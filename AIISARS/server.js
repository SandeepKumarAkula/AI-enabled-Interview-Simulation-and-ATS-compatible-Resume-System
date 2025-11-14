import next from "next";

const port = process.env.PORT || 3000;
const dev = false;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  console.log("🚀 Next.js app ready on port:", port);
  app
    .getRequestHandler()( // reuse Next's built-in handler
      { url: "/", method: "GET" },
      { end: () => {} }
    );

  app
    .getServer()
    .listen(port, () => console.log(`Server listening on ${port}`));
});
