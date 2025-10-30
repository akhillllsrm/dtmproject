// From javascript_log_in_with_replit blueprint
import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { streamChatCompletion, summarizeDiscussion } from "./openai";
import { insertPostSchema, insertCommentSchema, insertPostVoteSchema, insertCommentVoteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Post routes
  app.get("/api/posts", async (req, res) => {
    try {
      const { board, sortBy, limit, offset } = req.query;
      const posts = await storage.getPosts({
        board: board as string | undefined,
        sortBy: (sortBy as 'hot' | 'new' | 'top') || 'hot',
        limit: limit ? parseInt(limit as string) : 50,
        offset: offset ? parseInt(offset as string) : 0,
      });
      
      // Get author info for each post
      const postsWithAuthors = await Promise.all(
        posts.map(async (post) => {
          const author = await storage.getUser(post.authorId);
          return { ...post, author };
        })
      );
      
      res.json(postsWithAuthors);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const post = await storage.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const author = await storage.getUser(post.authorId);
      res.json({ ...post, author });
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.post("/api/posts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate request body
      const validatedData = insertPostSchema.parse({
        ...req.body,
        authorId: userId,
        tags: req.body.tags || [],
      });
      
      const post = await storage.createPost(validatedData);
      
      const author = await storage.getUser(userId);
      res.status(201).json({ ...post, author });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  // Comment routes
  app.get("/api/posts/:postId/comments", async (req, res) => {
    try {
      const comments = await storage.getPostComments(req.params.postId);
      
      // Get author info for each comment
      const commentsWithAuthors = await Promise.all(
        comments.map(async (comment) => {
          const author = await storage.getUser(comment.authorId);
          return { ...comment, author };
        })
      );
      
      res.json(commentsWithAuthors);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/comments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate request body
      const validatedData = insertCommentSchema.parse({
        ...req.body,
        authorId: userId,
        parentId: req.body.parentId || null,
      });
      
      const comment = await storage.createComment(validatedData);
      
      const author = await storage.getUser(userId);
      res.status(201).json({ ...comment, author });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Vote routes
  app.post("/api/posts/:postId/vote", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate request body
      const validatedData = insertPostVoteSchema.parse({
        userId,
        postId: req.params.postId,
        value: req.body.value,
      });
      
      // Update or create vote (this also updates vote count on post and returns delta)
      const delta = await storage.upsertPostVote(validatedData.userId, validatedData.postId, validatedData.value);
      
      // Award reputation to post author based on delta
      const post = await storage.getPost(validatedData.postId);
      if (post && post.authorId !== userId) {
        await storage.updateUserReputation(post.authorId, delta * 10);
      }
      
      res.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error voting on post:", error);
      res.status(500).json({ message: "Failed to vote" });
    }
  });

  app.post("/api/comments/:commentId/vote", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate request body
      const validatedData = insertCommentVoteSchema.parse({
        userId,
        commentId: req.params.commentId,
        value: req.body.value,
      });
      
      // Update or create vote (this also updates vote count on comment)
      await storage.upsertCommentVote(validatedData.userId, validatedData.commentId, validatedData.value);
      
      res.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error voting on comment:", error);
      res.status(500).json({ message: "Failed to vote" });
    }
  });

  // Saved posts routes
  app.get("/api/saved-posts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const posts = await storage.getSavedPosts(userId);
      
      // Get author info for each post
      const postsWithAuthors = await Promise.all(
        posts.map(async (post) => {
          const author = await storage.getUser(post.authorId);
          return { ...post, author };
        })
      );
      
      res.json(postsWithAuthors);
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      res.status(500).json({ message: "Failed to fetch saved posts" });
    }
  });

  app.post("/api/saved-posts/:postId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.savePost(userId, req.params.postId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving post:", error);
      res.status(500).json({ message: "Failed to save post" });
    }
  });

  app.delete("/api/saved-posts/:postId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.unsavePost(userId, req.params.postId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error unsaving post:", error);
      res.status(500).json({ message: "Failed to unsave post" });
    }
  });

  app.get("/api/saved-posts/:postId/status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const saved = await storage.isPostSaved(userId, req.params.postId);
      res.json({ saved });
    } catch (error) {
      console.error("Error checking saved status:", error);
      res.status(500).json({ message: "Failed to check saved status" });
    }
  });

  // AI Chat routes
  app.post("/api/chat", isAuthenticated, async (req: any, res) => {
    try {
      const { message, conversationId } = req.body;
      const userId = req.user.claims.sub;
      
      // Get or create conversation
      let conversation;
      if (conversationId) {
        conversation = await storage.getConversation(conversationId);
        if (!conversation || conversation.userId !== userId) {
          return res.status(404).json({ message: "Conversation not found" });
        }
      } else {
        conversation = await storage.createConversation(userId, "New Conversation");
      }
      
      // Save user message
      await storage.createMessage(conversation.id, 'user', message);
      
      // Get conversation history
      const messages = await storage.getConversationMessages(conversation.id);
      const chatMessages = messages.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
      
      // Add system message for context
      const systemMessage = {
        role: "system" as const,
        content: "You are a helpful AI study assistant. Help students understand concepts, solve problems, and learn effectively. Provide clear, step-by-step explanations. Support markdown for formatting and code blocks.",
      };
      
      // Stream response
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      let fullResponse = "";
      
      await streamChatCompletion(
        [systemMessage, ...chatMessages],
        (chunk) => {
          fullResponse += chunk;
          res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        },
        async () => {
          // Save assistant message
          await storage.createMessage(conversation.id, 'assistant', fullResponse);
          res.write(`data: ${JSON.stringify({ done: true, conversationId: conversation.id })}\n\n`);
          res.end();
        }
      );
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Chat failed" });
    }
  });

  // Summarize discussion route
  app.post("/api/posts/:postId/summarize", isAuthenticated, async (req, res) => {
    try {
      const post = await storage.getPost(req.params.postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const comments = await storage.getPostComments(req.params.postId);
      const commentsWithAuthors = await Promise.all(
        comments.map(async (comment) => {
          const author = await storage.getUser(comment.authorId);
          return {
            author: author?.firstName || author?.email || "Anonymous",
            content: comment.content,
          };
        })
      );
      
      const summary = await summarizeDiscussion(
        post.title,
        post.content,
        commentsWithAuthors
      );
      
      res.json({ summary });
    } catch (error) {
      console.error("Summarize error:", error);
      res.status(500).json({ message: "Failed to summarize discussion" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
