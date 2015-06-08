
module.exports = function(grunt){
  grunt.loadNpmTasks("steal-tools");

  grunt.initConfig({
    "steal-build": {
      app: {
        options:  {
          system: {
            config: __dirname + "/package.json!npm",
            buildMode: true
          },
          buildOptions: {
            bundlesPath: __dirname + "/dist/bundles"
          }
        }
      }
    }
  });

  grunt.registerTask("build", [ "steal-build" ]);
  grunt.registerTask("default", [ "build" ]);
};
