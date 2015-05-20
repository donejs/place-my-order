
module.exports = function(grunt){
  grunt.loadNpmTasks("steal-tools");

  grunt.initConfig({
    "steal-build": {
      app: {
        options:  {
          system: {
            config: __dirname + "/public/package.json!npm",
            buildMode: true
          },
          buildOptions: {
            bundlesPath: __dirname + "/public/dist/bundles",
            minify: false
          }
        }
      }
    }
  });

  grunt.registerTask("build", [ "steal-build" ]);
  grunt.registerTask("default", [ "build" ]);
};
