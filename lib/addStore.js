'use strict';

const exec = require('child_process').exec;
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const fs = require('fs');
const { getTemplatePath, renderFile, renderAppendFile, getResourceTemplateData } = require('./utils');
const { default: nj, expression: n } = require('nornj/dist/nornj.common');
const includeParser = require('nornj/tools/includeParser');
require('./nj.config');
const inquirer = require('inquirer');

module.exports = () => {
  let storeName;
  const pkg = require(`${process.cwd()}/package.json`);
  const templateType = pkg.templateType ? pkg.templateType : pkg.njCliConfig.templateType;
  const isApp = templateType === 'single-page-app';
  const templateMultiPage = templateType == 'multi-page';

  if (templateMultiPage) {
    // todo
  } else {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'storeTemplate',
          message: 'Which store template do you want to use?',
          choices: pkg.njCliConfig.storeTemplates
            ? pkg.njCliConfig.storeTemplates.map(item => (nj.isObject(item) ? (item.alias ? item.alias : item.name) : item))
            : ['default', 'mobx']
        }
      ])
      .then(answers => {
        co(function*() {
          const { templateName, templateData } = getResourceTemplateData(
            answers.storeTemplate,
            pkg.njCliConfig.storeTemplates
          );
          const storeTemplate = templateName === 'default' ? '' : n`${templateName} | capitalize`;
          storeName = process.argv[3];
          if (storeName == null) {
            storeName = yield prompt('Store Name: ');
          }

          //store resource files
          renderFile(
            `./templates/src/stores/newStore${storeTemplate}.js.nornj`,
            `./src/stores/${storeName}Store.js`,
            {
              storeName
            },
            templateData
          );

          console.log(chalk.green('\n √ Created store finished!'));
          process.exit();
        });
      });
  }
};
