// app/webpack.renderer.config.js
const rules = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader' },
    {
      loader: 'postcss-loader',
      options: { postcssOptions: { plugins: [require('tailwindcss'), require('autoprefixer')] } },
    },
  ],
});

module.exports = {
  module: { rules },
  devServer: {
    headers: {
      'Content-Security-Policy': [
        "default-src 'self' data: blob:",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self' data:",
        "connect-src 'self' http://127.0.0.1:5000 ws: http: https:",
        "worker-src 'self' blob:"
      ].join('; ')
    }
  }
};
