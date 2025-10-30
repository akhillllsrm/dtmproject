import { TopicBoardCard } from "@/components/topic-board-card";
import { Calculator, Beaker, Code, PenTool, GraduationCap } from "lucide-react";

const boards = [
  {
    name: "Math",
    icon: Calculator,
    postCount: 1247,
    activeUsers: 89,
    lastActivity: new Date(Date.now() - 1000 * 60 * 15),
    description: "Algebra, calculus, geometry, and all things mathematics",
  },
  {
    name: "Science",
    icon: Beaker,
    postCount: 892,
    activeUsers: 64,
    lastActivity: new Date(Date.now() - 1000 * 60 * 8),
    description: "Physics, chemistry, biology, and scientific inquiry",
  },
  {
    name: "Coding",
    icon: Code,
    postCount: 2341,
    activeUsers: 156,
    lastActivity: new Date(Date.now() - 1000 * 60 * 3),
    description: "Programming, debugging, algorithms, and software development",
  },
  {
    name: "Writing",
    icon: PenTool,
    postCount: 543,
    activeUsers: 42,
    lastActivity: new Date(Date.now() - 1000 * 60 * 25),
    description: "Essays, creative writing, grammar, and composition help",
  },
  {
    name: "Exams",
    icon: GraduationCap,
    postCount: 678,
    activeUsers: 98,
    lastActivity: new Date(Date.now() - 1000 * 60 * 12),
    description: "Test preparation, study strategies, and exam tips",
  },
];

export default function TopicBoards() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2" data-testid="text-page-title">
            Topic Boards
          </h1>
          <p className="text-muted-foreground">
            Explore different topics and join discussions with fellow students
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <TopicBoardCard
              key={board.name}
              {...board}
              onClick={() => console.log("Open board", board.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
