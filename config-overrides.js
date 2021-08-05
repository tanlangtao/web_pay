const {override,fixBabelImports,addPostcssPlugins}=require('customize-cra');
module.exports = override(
    fixBabelImports('import',{
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
    }),
    addPostcssPlugins([
        require('postcss-px2rem-exclude')({ 
            remUnit: 37.5
        ,exclude:/node_modules/i})
    ])
)