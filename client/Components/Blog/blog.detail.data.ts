import { BlogDetail } from "./blog.types";

export const BLOG_DETAILS: Record<string, BlogDetail> = {
  "1": {
    id: "1",
    title: "Getting Started with React Hooks",
    excerpt:
      "Learn how to use React Hooks to manage state and side effects in functional components.",
    author: "John Doe",
    authorImage: "/images/author.avif",
    authorBio:
      "Full-stack developer with 8+ years of experience building scalable web applications. Passionate about React and modern JavaScript.",
    coverImage: "/images/bg.avif",
    publishedAt: "2 days ago",
    publishedOn: "2026-02-20",
    readMinutes: 5,
    category: "React",
    likes: 245,
    comments: 32,
    views: 1200,
    tags: ["React", "Hooks", "JavaScript", "Frontend"],
    content: `
# Getting Started with React Hooks

React Hooks have revolutionized the way we write React components. They allow you to use state and other React features without writing class components.

## What are React Hooks?

React Hooks are functions that let you "hook into" React state and lifecycle features from functional components. They make your code more reusable and easier to understand.

## Common Hooks

### useState

The \`useState\` hook lets you add state to functional components:

\`\`\`jsx
const [count, setCount] = useState(0);

return (
  <div>
    <p>Count: {count}</p>
    <button onClick={() => setCount(count + 1)}>
      Increment
    </button>
  </div>
);
\`\`\`

### useEffect

The \`useEffect\` hook lets you perform side effects in functional components:

\`\`\`jsx
useEffect(() => {
  // Side effect code here
  document.title = \`You clicked \${count} times\`;

  // Cleanup function (optional)
  return () => {
    // Cleanup code
  };
}, [count]); // Dependency array
\`\`\`

## Best Practices

1. **Only call Hooks at the top level** - Don't call Hooks inside loops, conditions, or nested functions
2. **Only call Hooks from React functions** - Call them from functional components or custom hooks
3. **Use the ESLint plugin** - Install \`eslint-plugin-react-hooks\` to catch mistakes

## Conclusion

React Hooks are a powerful feature that makes functional components more capable. Start with \`useState\` and \`useEffect\`, then explore other hooks as you grow more comfortable.
    `,
  },
  "2": {
    id: "2",
    title: "The Future of Web Development",
    excerpt:
      "Exploring emerging technologies and trends that will shape web development in 2026.",
    author: "Jane Smith",
    authorImage: "/images/author.avif",
    authorBio:
      "Tech writer and developer advocate. Loves exploring cutting-edge technologies and sharing insights with the community.",
    coverImage: "/images/bg.avif",
    publishedAt: "4 days ago",
    publishedOn: "2026-02-18",
    readMinutes: 8,
    category: "Web Dev",
    likes: 512,
    comments: 78,
    views: 2500,
    tags: ["Web Development", "Technology", "Future", "Trends"],
    content: `
# The Future of Web Development

Web development is constantly evolving. Let's explore the trends and technologies that will define 2026 and beyond.

## AI-Powered Development

Artificial intelligence is transforming how we build applications. From code generation to automated testing, AI tools are becoming essential.

## Edge Computing

The shift to edge computing means processing data closer to users, resulting in faster, more responsive applications.

## WebAssembly Adoption

WebAssembly continues to mature, enabling high-performance applications that run directly in browsers.

## Key Takeaways

- Stay curious and keep learning
- Experiment with new technologies
- Focus on core principles that don't change

The future is exciting, and the possibilities are endless!
    `,
  },
  "3": {
    id: "3",
    title: "TypeScript Best Practices",
    excerpt:
      "Master TypeScript with practical patterns that keep large apps maintainable.",
    author: "Mike Johnson",
    authorImage: "/images/author.avif",
    authorBio: "Senior TypeScript developer. Advocate for type safety and clean code architecture.",
    coverImage: "/images/bg.avif",
    publishedAt: "1 week ago",
    publishedOn: "2026-02-15",
    readMinutes: 10,
    category: "TypeScript",
    likes: 389,
    comments: 56,
    views: 1800,
    tags: ["TypeScript", "Best Practices", "Code Quality"],
    content: `
# TypeScript Best Practices

TypeScript helps you write safer, more maintainable code. Here are the best practices to follow.

## Use strict mode

Always enable \`strict\` mode in your \`tsconfig.json\`:

\`\`\`json
{
  "compilerOptions": {
    "strict": true
  }
}
\`\`\`

## Avoid any

Never use \`any\` type. It defeats the purpose of TypeScript. Use \`unknown\` or proper types instead.

## Interfaces over Types

For object shapes, prefer \`interface\` over \`type\` for better extensibility.

## Discriminated Unions

Use discriminated unions for better type narrowing:

\`\`\`typescript
type Success = { status: 'success'; data: string };
type Error = { status: 'error'; message: string };

type Result = Success | Error;
\`\`\`

## Conclusion

Following these practices will make your codebase more maintainable and less error-prone.
    `,
  },
};
