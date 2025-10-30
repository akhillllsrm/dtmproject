import { CommentItem } from '../comment-item'

export default function CommentItemExample() {
  return (
    <div className="space-y-4 max-w-3xl">
      <CommentItem
        id="1"
        author={{
          name: "Alex Johnson",
          reputation: 2840
        }}
        content="Great question! The product rule states that if you have f(x) = u(x) · v(x), then f'(x) = u'(x) · v(x) + u(x) · v'(x). In your case, u(x) = x³ and v(x) = sin(x)."
        votes={15}
        createdAt={new Date(Date.now() - 1000 * 60 * 30)}
        replies={[
          {
            id: "2",
            author: {
              name: "Sarah Chen",
              reputation: 1250
            },
            content: "Thank you! That makes so much more sense now. So I need to find the derivative of x³ which is 3x², and the derivative of sin(x) which is cos(x), right?",
            votes: 8,
            createdAt: new Date(Date.now() - 1000 * 60 * 25)
          }
        ]}
        onReply={(id) => console.log('Reply to comment', id)}
      />
    </div>
  )
}
