import React, { Component } from 'react';
import { observable, computed, toJS } from 'mobx'
import { observer, inject } from 'mobx-react';
import nj from 'nornj';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';

import 'flarej/lib/components/antd/radio';
import 'flarej/lib/components/antd/button';
import 'flarej/lib/components/antd/cascader';
import 'flarej/lib/components/antd/datepicker';
import 'flarej/lib/components/antd/checkbox';

import Message from 'flarej/lib/components/antd/message';
import Notification from 'flarej/lib/components/antd/notification';

import styles from './#{pageName}#.m.scss';
import tmpls from './#{pageName}#.t.html';

// 页面容器组件
@inject('store')
@observer
@registerTmpl('#{pageName | pascal}#')
export default class #{pageName | pascal}# extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const { store: { #{pageName}# } } = this.props;
    return tmpls.#{pageName}#(this.state, this.props, this, {
      styles,
      #{pageName}#
    });
  }
}