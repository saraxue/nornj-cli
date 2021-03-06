import React, { Component } from 'react';
import { observable, computed, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import {
  Input,
  Select,
  Radio,
  Button,
  Cascader,
  DatePicker,
  Checkbox,
  Form
} from 'flarej/antd';
import {
  Input as ElInput,
  Select as ElSelect,
  Radio as ElRadio,
  Switch as ElSwitch,
  Cascader as ElCascader,
  DatePicker as ElDatePicker,
  Checkbox as ElCheckbox,
  Form as ElForm
} from 'flarej/element';
import { isIElt11 } from 'flarej/lib/utils/browsers';
import styles from './#{pageName}#.m.scss';
import tmpls from './#{pageName}#.t.html';

// 页面容器组件
@registerTmpl('#{pageName | capitalize}#')
@inject('store')
@observer
export default class #{pageName | capitalize}# extends Component {
  render() {
    const { store: { #{pageName}# } } = this.props;
    return tmpls.container({
      styles,
      #{pageName}#,
      isIElt11
    }, this.props, this);
  }
}

@registerTmpl('AntForm#{pageName | capitalize}#')
@inject('store')
@observer
@Form.create()
@observer
class AntForm extends Component {

  @observable inputValue = '示例数据';

  @observable textareaValue = '示例数据';

  @observable selectValue = '1';

  @observable checkboxValue = ['2'];

  formEl1({ name, props, result }) {
    return this.props.form.getFieldDecorator(name, {...{
      rules: [{ required: true, message: '表单元素1不能为空！' }]
    }, ...props})(result());
  }

  formEl2({ name, props, result }) {
    return this.props.form.getFieldDecorator(name, {...{
      rules: [{ required: true, message: '表单元素2不能为空！' }]
    }, ...props})(result());
  }

  formEl3({ name, props, result }) {
    return this.props.form.getFieldDecorator(name, {...{
      rules: [{ required: true, message: '表单元素3不能为空！' }]
    }, ...props})(result());
  }

  formEl4({ name, props, result }) {
    return this.props.form.getFieldDecorator(name, {...{
      rules: [{ required: true, message: '表单元素4不能为空！' }]
    }, ...props})(result());
  }

  formEl5({ name, props, result }) {
    return this.props.form.getFieldDecorator(name, {...{
      rules: [{ required: true, message: '表单元素5不能为空！' }]
    }, ...props})(result());
  }

  @autobind
  onAntSubmit(e) {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
  }

  @autobind
  onAntReset() {
    this.props.form.resetFields();
  }

  render() {
    const { store: { #{pageName}# } } = this.props;
    return tmpls.antForm({
      styles,
      #{pageName}#
    }, this.props, this);
  }
}

@registerTmpl('ElemForm#{pageName | capitalize}#')
@inject('store')
@observer
class ElemForm extends Component {

  rules = {
    formEl1: [
      { required: true, message: '表单元素1不能为空！' }
    ],
    formEl2: [
      { required: true, message: '表单元素2不能为空！' }
    ],
    formEl3: [
      { required: true, message: '表单元素3不能为空！' }
    ],
    formEl4: [
      { required: true, message: '表单元素4不能为空！', type:'array' }
    ],
    formEl5: [
      { required: true, message: '表单元素5不能为空！' }
    ]
  };

  @autobind
  onElSubmit(e) {
    e.preventDefault();

    this.refs.form.validate((valid) => {
      if (valid) {
        const { store: { #{pageName}# } } = this.props;

        console.log(#{pageName}#.elInputValue);
        console.log(#{pageName}#.elSelectValue);
        console.log(#{pageName}#.elRadioValue);
        console.log(#{pageName}#.elCheckboxValue);
        console.log(#{pageName}#.elDate);
      }
    });
  }

  @autobind
  onElReset() {
    //Element-React的form.resetFields存在bug
    this.refs.form.resetFields();
  }

  render() {
    const { store: { #{pageName}# } } = this.props;
    return tmpls.elemForm({
      styles,
      #{pageName}#
    }, this.props, this);
  }
}