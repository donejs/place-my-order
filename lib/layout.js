export default function(content){
  return `
    <!DOCTYPE html>
    <html>
    <head lang="en">
      <meta charset="UTF-8">
      <title>Place my order</title>
    </head>
    <body>
      ${content}
      <script type="text/javascript" src="/node_modules/steal/steal.js"></script>
    </body>
    </html>
  `;
};
