// From javascript_database and javascript_log_in_with_replit blueprints
import {
  users,
  posts,
  comments,
  postVotes,
  commentVotes,
  savedPosts,
  chatConversations,
  chatMessages,
  type User,
  type UpsertUser,
  type Post,
  type InsertPost,
  type Comment,
  type InsertComment,
  type PostVote,
  type CommentVote,
  type ChatConversation,
  type ChatMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql, asc } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Post operations
  createPost(post: InsertPost): Promise<Post>;
  getPost(id: string): Promise<Post | undefined>;
  getPosts(options?: { board?: string; limit?: number; offset?: number; sortBy?: 'hot' | 'new' | 'top' }): Promise<Post[]>;
  getUserPosts(userId: string): Promise<Post[]>;
  updatePostVotes(postId: string, delta: number): Promise<void>;
  incrementPostCommentCount(postId: string): Promise<void>;
  
  // Comment operations
  createComment(comment: InsertComment): Promise<Comment>;
  getPostComments(postId: string): Promise<Comment[]>;
  updateCommentVotes(commentId: string, delta: number): Promise<void>;
  
  // Vote operations
  upsertPostVote(userId: string, postId: string, value: number): Promise<number>;
  upsertCommentVote(userId: string, commentId: string, value: number): Promise<number>;
  getPostVote(userId: string, postId: string): Promise<PostVote | undefined>;
  getCommentVote(userId: string, commentId: string): Promise<CommentVote | undefined>;
  
  // Saved posts operations
  savePost(userId: string, postId: string): Promise<void>;
  unsavePost(userId: string, postId: string): Promise<void>;
  getSavedPosts(userId: string): Promise<Post[]>;
  isPostSaved(userId: string, postId: string): Promise<boolean>;
  
  // Chat operations
  createConversation(userId: string, title?: string): Promise<ChatConversation>;
  getConversation(id: string): Promise<ChatConversation | undefined>;
  getUserConversations(userId: string): Promise<ChatConversation[]>;
  createMessage(conversationId: string, role: 'user' | 'assistant', content: string): Promise<ChatMessage>;
  getConversationMessages(conversationId: string): Promise<ChatMessage[]>;
  
  // Reputation operations
  updateUserReputation(userId: string, delta: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  // Post operations
  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async getPost(id: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async getPosts(options?: { board?: string; limit?: number; offset?: number; sortBy?: 'hot' | 'new' | 'top' }): Promise<Post[]> {
    const { board, limit = 50, offset = 0, sortBy = 'hot' } = options || {};
    
    let query = db.select().from(posts);
    
    if (board) {
      query = query.where(eq(posts.board, board)) as any;
    }
    
    // Sort based on sortBy parameter
    if (sortBy === 'new') {
      query = query.orderBy(desc(posts.createdAt)) as any;
    } else if (sortBy === 'top') {
      query = query.orderBy(desc(posts.votes)) as any;
    } else {
      // 'hot' - combination of votes and recency
      query = query.orderBy(desc(posts.votes), desc(posts.createdAt)) as any;
    }
    
    query = query.limit(limit).offset(offset) as any;
    
    return query;
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    return db.select().from(posts).where(eq(posts.authorId, userId)).orderBy(desc(posts.createdAt));
  }

  async updatePostVotes(postId: string, delta: number): Promise<void> {
    await db
      .update(posts)
      .set({ votes: sql`${posts.votes} + ${delta}` })
      .where(eq(posts.id, postId));
  }

  async incrementPostCommentCount(postId: string): Promise<void> {
    await db
      .update(posts)
      .set({ commentCount: sql`${posts.commentCount} + 1` })
      .where(eq(posts.id, postId));
  }
  
  // Comment operations
  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    await this.incrementPostCommentCount(comment.postId);
    return newComment;
  }

  async getPostComments(postId: string): Promise<Comment[]> {
    return db.select().from(comments).where(eq(comments.postId, postId)).orderBy(asc(comments.createdAt));
  }

  async updateCommentVotes(commentId: string, delta: number): Promise<void> {
    await db
      .update(comments)
      .set({ votes: sql`${comments.votes} + ${delta}` })
      .where(eq(comments.id, commentId));
  }
  
  // Vote operations
  async upsertPostVote(userId: string, postId: string, value: number): Promise<number> {
    const [existingVote] = await db
      .select()
      .from(postVotes)
      .where(and(eq(postVotes.userId, userId), eq(postVotes.postId, postId)));

    const delta = existingVote ? value - existingVote.value : value;

    await db
      .insert(postVotes)
      .values({ userId, postId, value })
      .onConflictDoUpdate({
        target: [postVotes.userId, postVotes.postId],
        set: { value },
      });

    await this.updatePostVotes(postId, delta);
    return delta;
  }

  async upsertCommentVote(userId: string, commentId: string, value: number): Promise<number> {
    const [existingVote] = await db
      .select()
      .from(commentVotes)
      .where(and(eq(commentVotes.userId, userId), eq(commentVotes.commentId, commentId)));

    const delta = existingVote ? value - existingVote.value : value;

    await db
      .insert(commentVotes)
      .values({ userId, commentId, value })
      .onConflictDoUpdate({
        target: [commentVotes.userId, commentVotes.commentId],
        set: { value },
      });

    await this.updateCommentVotes(commentId, delta);
    return delta;
  }

  async getPostVote(userId: string, postId: string): Promise<PostVote | undefined> {
    const [vote] = await db
      .select()
      .from(postVotes)
      .where(and(eq(postVotes.userId, userId), eq(postVotes.postId, postId)));
    return vote;
  }

  async getCommentVote(userId: string, commentId: string): Promise<CommentVote | undefined> {
    const [vote] = await db
      .select()
      .from(commentVotes)
      .where(and(eq(commentVotes.userId, userId), eq(commentVotes.commentId, commentId)));
    return vote;
  }
  
  // Saved posts operations
  async savePost(userId: string, postId: string): Promise<void> {
    await db
      .insert(savedPosts)
      .values({ userId, postId })
      .onConflictDoNothing();
  }

  async unsavePost(userId: string, postId: string): Promise<void> {
    await db
      .delete(savedPosts)
      .where(and(eq(savedPosts.userId, userId), eq(savedPosts.postId, postId)));
  }

  async getSavedPosts(userId: string): Promise<Post[]> {
    const saved = await db
      .select({ post: posts })
      .from(savedPosts)
      .innerJoin(posts, eq(savedPosts.postId, posts.id))
      .where(eq(savedPosts.userId, userId))
      .orderBy(desc(savedPosts.createdAt));
    
    return saved.map(s => s.post);
  }

  async isPostSaved(userId: string, postId: string): Promise<boolean> {
    const [saved] = await db
      .select()
      .from(savedPosts)
      .where(and(eq(savedPosts.userId, userId), eq(savedPosts.postId, postId)));
    return !!saved;
  }
  
  // Chat operations
  async createConversation(userId: string, title?: string): Promise<ChatConversation> {
    const [conversation] = await db
      .insert(chatConversations)
      .values({ userId, title })
      .returning();
    return conversation;
  }

  async getConversation(id: string): Promise<ChatConversation | undefined> {
    const [conversation] = await db
      .select()
      .from(chatConversations)
      .where(eq(chatConversations.id, id));
    return conversation;
  }

  async getUserConversations(userId: string): Promise<ChatConversation[]> {
    return db
      .select()
      .from(chatConversations)
      .where(eq(chatConversations.userId, userId))
      .orderBy(desc(chatConversations.updatedAt));
  }

  async createMessage(conversationId: string, role: 'user' | 'assistant', content: string): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values({ conversationId, role, content })
      .returning();
    
    // Update conversation timestamp
    await db
      .update(chatConversations)
      .set({ updatedAt: new Date() })
      .where(eq(chatConversations.id, conversationId));
    
    return message;
  }

  async getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
    return db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(asc(chatMessages.createdAt));
  }
  
  // Reputation operations
  async updateUserReputation(userId: string, delta: number): Promise<void> {
    await db
      .update(users)
      .set({ reputation: sql`${users.reputation} + ${delta}` })
      .where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
