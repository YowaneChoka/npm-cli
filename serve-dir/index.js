#!/usr/bin/env node
const express = require('express');
const path = require('path');
const app = express();

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers'); // For better compatibility

// Parse command line arguments using yargs
const argv = yargs(hideBin(process.argv))
  .option('port', {
    alias: 'p',
    type: 'number',
    description: 'Port to run the server on',
    default: 8000
  })
  .option('path', {
    alias: 'd',
    type: 'string',
    description: 'Path to serve static files from',
    default: path.join(process.cwd())
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
    default: false
  })
  .argv;


let port = argv.port;
let staticPath = argv.path.replaceAll('\\ ',' ');

// Serve static files from the specified directory
app.use(express.static(staticPath));

// Serve index.html for any unmatched routes (for Single Page Applications)
app.get('*', (req, res) => {
  const fileSendPath = path.resolve(staticPath.replaceAll(/\"\'/g, ''), 'index.html');
  res.sendFile(fileSendPath);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Serving files from: ${staticPath}`);
});