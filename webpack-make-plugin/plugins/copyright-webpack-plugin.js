class CopyrightWebpackPlugin {
    // constructor(options) {
    //     // console.log(options);
    // }

    apply(compiler) {
        compiler.hooks.emit.tapAsync('CopyrightWebpackPlugin', (compilation, callback) => {
             console.log('This is an example plugin!');
             console.log('Here’s the `compilation` object which represents a single build of assets:', compilation);

             // Manipulate the build using the plugin API provided by webpack
             // compilation.addModule(/* ... */);
             callback();
        });
    }
}

module.exports = CopyrightWebpackPlugin;