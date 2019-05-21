import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, computed, toJS } from 'mobx';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import styles from './#{pageName}#.m.scss';
import { Toast, Tabs, Card, WingBlank, WhiteSpace, SegmentedControl, Button, Modal } from 'antd-mobile';
import echarts from 'echarts/lib/echarts';
import { BarChart, LineChart, PieChart } from 'flarej/echarts';
import Conditions from '../../components/conditions';
import graphic from 'echarts/lib/util/graphic';

@registerTmpl('#{pageName | capitalize}#')
@inject('store')
@observer
export default class #{pageName | capitalize}# extends Component {
  @observable
  switchIndex = 0;
  @observable
  showMode = '';

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.store.header.setPageTitle(this.props.moduleName);
    this.showMode = this.props.store.common.userInfo.viewDataRole;
  }

  @autobind
  onSearch() {
    Toast.loading('loading...');
    const searchConditions = {
      categoryId1: this.props.store.conditions.selectedCategory[0] || '',
      categoryId2: this.props.store.conditions.selectedCategory[1] || '',
      categoryId3: this.props.store.conditions.selectedCategory[2] || '',
      brandId: this.props.store.conditions.selectedBrand || '',
      date: this.props.store.conditions.selectedDate || '',
      page: 1,
      pagesize: 10
    };
    Promise.all([
      this.props.store.#{pageName}#.getSummaryData(searchConditions),
      this.props.store.#{pageName}#.getGrowthData(searchConditions),
      this.props.store.#{pageName}#.getSubCategoryData(searchConditions),
      this.props.store.#{pageName}#.getBarSubCategoryData(searchConditions),
      this.props.store.#{pageName}#.getTableSubCategoryData(searchConditions),
      this.props.store.#{pageName}#.getBrandCompareList(searchConditions),
      this.props.store.#{pageName}#.getBrandCompareItemForCategory(searchConditions)
    ]).then(() => {
      this.props.store.#{pageName}#.clearCompareDockData();
      Toast.hide();
    });
  }

  //销售额趋势
  @computed
  get salesOptions() {
    return {
      grid: {
        left: '0',
        right: '4%',
        top: '15%',
        bottom: '15%',
        containLabel: true
      },
      legend: {
        show: true,
        right: 0,
        top: 0,
        data:
          this.showMode === null
            ? [this.props.store.common.isDemo ? '品牌商' : '品牌商']
            : [this.props.store.common.isDemo ? '品牌商' : '品牌商', '品类']
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        confine: true,
        formatter: params => {
          if (this.showMode === 'viewDataRoleLine') {
            params = params.slice(0, 1);
          }
          var result = `<div>${params[0].name}</div>`;
          params.forEach(function(item) {
            result += `<div>
                         <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${
                           item.color
                         }"></span>
                         <span>${item.seriesName}:</span>
                         <span>${item.data || '--'}</span>
                       </div>`;
          });
          return result;
        }
      },
      toolbox: { show: false },
      xAxis: {
        type: 'category',
        // boundaryGap: true,
        axisPointer: {
          snap: true,
          lineStyle: {
            color: '#ccc',
            opacity: 0.5,
            width: 2
          },
          handle: {
            show: true,
            color: '#A5B7CB'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#333'
          }
        },
        data: toJS(this.props.store.#{pageName}#.salesData && this.props.store.#{pageName}#.salesData[2])
      },
      yAxis: {
        show: false,
        type: 'value',
        scale: true,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#333'
          }
        }
      }
    };
  }
  @computed
  get salesData() {
    const lineData = toJS(
      this.props.store.#{pageName}#.salesData &&
        this.props.store.#{pageName}#.salesData[1].map(item => (item / 10000).toFixed(2))
    );
    return [
      {
        name: '品牌商',
        type: 'bar',
        barWidth: '70%',
        data: toJS(
          this.props.store.#{pageName}#.salesData &&
            this.props.store.#{pageName}#.salesData[0].map(item => (item / 10000).toFixed(2))
        )
      },
      {
        name: '品类',
        type: 'line',
        data: this.showMode === null ? [] : lineData
      }
    ];
  }

  //销售额同比增长率趋势
  @computed
  get salesRatesOptions() {
    return {
      grid: {
        left: '3%',
        right: '4%',
        top: '15%',
        bottom: '15%',
        containLabel: true
      },
      legend: {
        show: true,
        right: 0,
        top: 0,
        data:
          this.showMode === null
            ? [this.props.store.common.isDemo ? '品牌商' : '品牌商']
            : [this.props.store.common.isDemo ? '品牌商' : '品牌商', '品类']
      },
      tooltip: {
        show: true,
        confine: true,
        trigger: 'axis',
        formatter: params => {
          if (this.showMode === 'viewDataRoleLine') {
            params = params.slice(0, 1);
          }
          var result = `<div>${params[0].name}</div>`;
          params.forEach(function(item) {
            result += `<div>
                                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${
                                  item.color
                                }"></span>
                                <span>${item.seriesName}:</span>
                                <span>${item.data || '--'}%</span>
                            </div>`;
          });
          return result;
        }
      },
      toolbox: { show: false },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        axisPointer: {
          snap: true,
          lineStyle: {
            color: '#ccc',
            opacity: 0.5,
            width: 2
          },
          handle: {
            show: true,
            color: '#A5B7CB'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#333'
          }
        },
        data: toJS(this.props.store.#{pageName}#.salesRatesData && this.props.store.#{pageName}#.salesRatesData[2])
      },
      yAxis: {
        type: 'value',
        scale: true,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#333'
          },
          formatter: '{value}%'
        }
      }
    };
  }
  @computed
  get salesRatesData() {
    const lineData = toJS(
      this.props.store.#{pageName}#.salesRatesData &&
        this.props.store.#{pageName}#.salesRatesData[1].map(item => (item * 100).toFixed(2))
    );
    return [
      {
        name: this.props.store.common.isDemo ? '品牌商' : '品牌商',
        type: 'line',
        data: toJS(
          this.props.store.#{pageName}#.salesRatesData &&
            this.props.store.#{pageName}#.salesRatesData[0].map(item => (item * 100).toFixed(2))
        )
      },
      {
        name: '品类',
        type: 'line',
        data: this.showMode === null ? [] : lineData
      }
    ];
  }

  //增长驱动力趋势
  @computed
  get growthOptions() {
    let dataX = [],
      unit = '';
    switch (this.switchIndex) {
      case 0:
        dataX = toJS(this.props.store.#{pageName}#.growthDataUV && this.props.store.#{pageName}#.growthDataUV[2]);
        unit = '%';
        break;
      case 1:
        dataX = toJS(
          this.props.store.#{pageName}#.growthDataUVConvert && this.props.store.#{pageName}#.growthDataUVConvert[2]
        );
        unit = '%';
        break;
      case 2:
        dataX = toJS(this.props.store.#{pageName}#.growthDataUser && this.props.store.#{pageName}#.growthDataUser[2]);
        unit = '%';
        break;
      case 3:
        dataX = toJS(this.props.store.#{pageName}#.growthDataPrice && this.props.store.#{pageName}#.growthDataPrice[2]);
        unit = '';
        break;
    }
    return {
      grid: {
        left: '3%',
        right: '4%',
        top: '15%',
        bottom: '15%',
        containLabel: true
      },
      legend: {
        show: true,
        right: 0,
        top: 0,
        data:
          this.showMode === null
            ? [this.props.store.common.isDemo ? '品牌商' : '品牌商']
            : [this.props.store.common.isDemo ? '品牌商' : '品牌商', '品类']
      },
      tooltip: {
        show: true,
        confine: true,
        trigger: 'axis',
        formatter: params => {
          if (this.showMode === 'viewDataRoleLine') {
            params = params.slice(0, 1);
          }
          var result = `<div>${params[0].name}</div>`;
          params.forEach(function(item) {
            result += `<div>
                         <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${
                           item.color
                         }"></span>
                         <span>${item.seriesName}:</span>
                         <span>${item.data || '--'}${unit}</span>
                       </div>`;
          });
          return result;
        }
      },
      toolbox: { show: false },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        axisPointer: {
          snap: true,
          lineStyle: {
            color: '#ccc',
            opacity: 0.5,
            width: 2
          },
          handle: {
            show: true,
            color: '#A5B7CB'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#333'
          }
        },
        data: dataX
      },
      yAxis: {
        type: 'value',
        scale: true,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#333'
          },
          formatter: `{value}${unit}`
        }
      }
    };
  }
  @computed
  get growthData() {
    let data1 = [],
      data2 = [];
    switch (this.switchIndex) {
      case 0:
        data1 = toJS(
          this.props.store.#{pageName}#.growthDataUV &&
            this.props.store.#{pageName}#.growthDataUV[0].map(item => (item * 100).toFixed(2))
        );
        data2 = toJS(
          this.props.store.#{pageName}#.growthDataUV &&
            this.props.store.#{pageName}#.growthDataUV[1].map(item => (item * 100).toFixed(2))
        );
        break;
      case 1:
        data1 = toJS(
          this.props.store.#{pageName}#.growthDataUVConvert &&
            this.props.store.#{pageName}#.growthDataUVConvert[0].map(item => (item * 100).toFixed(2))
        );
        data2 = toJS(
          this.props.store.#{pageName}#.growthDataUVConvert &&
            this.props.store.#{pageName}#.growthDataUVConvert[1].map(item => (item * 100).toFixed(2))
        );
        break;
      case 2:
        data1 = toJS(
          this.props.store.#{pageName}#.growthDataUser &&
            this.props.store.#{pageName}#.growthDataUser[0].map(item => (item * 100).toFixed(2))
        );
        data2 = toJS(
          this.props.store.#{pageName}#.growthDataUser &&
            this.props.store.#{pageName}#.growthDataUser[1].map(item => (item * 100).toFixed(2))
        );
        break;
      case 3:
        data1 = toJS(
          this.props.store.#{pageName}#.growthDataPrice &&
            this.props.store.#{pageName}#.growthDataPrice[0].map(item => item.toFixed(2))
        );
        data2 = toJS(
          this.props.store.#{pageName}#.growthDataPrice &&
            this.props.store.#{pageName}#.growthDataPrice[1].map(item => item.toFixed(2))
        );
        break;
    }
    return [
      {
        name: this.props.store.common.isDemo ? '品牌商' : '品牌商',
        type: 'line',
        data: data1
      },
      {
        name: '品类',
        type: 'line',
        data: this.showMode === null ? [] : data2
      }
    ];
  }

  @autobind
  onGrowthTypeChange(e) {
    this.switchIndex = e.nativeEvent.selectedSegmentIndex;
  }

  //下级品类对比
  @computed
  get pieCategoryOptions() {
    return {
      grid: {
        left: '3%',
        right: '3%',
        top: 0,
        bottom: 0,
        containLabel: true
      },
      tooltip: {
        trigger: 'item',
        confine: true,
        // formatter: "{a} <br/>{b} : {c} ({d}%)",
        formatter: function(params) {
          var result = `<div>${params.name}</div>`;
          result += `<div>
                              <span>${params.seriesName}:</span>
                              <span>${params.seriesName == '品类' ? '' : '(' + params.data.value + ')'} ${
            params.percent
          }%</span>
                          </div>`;
          return result;
        }
      },
      toolbox: { show: false },
      legend: {
        left: 'center',
        data: toJS(
          this.props.store.#{pageName}#.pieSubCategoryData && this.props.store.#{pageName}#.pieSubCategoryData[2]
        )
      },
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: '53%',
          z: 100,
          style: {
            fill: '#666',
            text: '品类'
          }
        },
        {
          type: 'text',
          left: 'center',
          top: '93%',
          z: 100,
          style: {
            fill: '#666',
            text: '品牌商'
          }
        }
      ]
    };
  }
  @computed
  get pieCategoryData() {
    let _data1 = [],
      _data2 = [];
    if (this.props.store.#{pageName}#.pieSubCategoryData) {
      this.props.store.#{pageName}#.pieSubCategoryData[0].forEach((item, i) => {
        _data1.push({
          value: (item / 10000).toFixed(2),
          name: this.props.store.#{pageName}#.pieSubCategoryData[2][i]
        });
      });
      this.props.store.#{pageName}#.pieSubCategoryData[1].forEach((item, i) => {
        _data2.push({
          value: (item / 10000).toFixed(2),
          name: this.props.store.#{pageName}#.pieSubCategoryData[2][i]
        });
      });
    }

    return [
      {
        name: '品类',
        radius: '40%',
        center: ['50%', '35%'],
        label: {
          normal: {
            show: false
          },
          emphasis: {
            show: true
          }
        },
        lableLine: {
          normal: {
            show: false
          },
          emphasis: {
            show: true
          }
        },
        data: _data1,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      },
      {
        name: this.props.store.common.isDemo ? '品牌商' : '品牌商',
        type: 'pie',
        radius: '40%',
        center: ['50%', '75%'],
        label: {
          normal: {
            show: false
          },
          emphasis: {
            show: true
          }
        },
        lableLine: {
          normal: {
            show: false
          },
          emphasis: {
            show: true
          }
        },
        data: _data2,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ];
  }
  //销售额同比增长率对比
  @computed
  get barCategoryOptions() {
    return {
      grid: {
        left: '3%',
        right: '4%',
        top: '15%',
        bottom: '15%',
        containLabel: true
      },
      legend: {
        show: true,
        right: 0,
        top: 0,
        data: [this.props.store.common.isDemo ? '品牌商' : '品牌商', '品类']
      },

      tooltip: {
        show: true,
        confine: true,
        trigger: 'axis',
        formatter: params => {
          if (this.showMode === 'viewDataRoleLine') {
            params = params.slice(0, 1);
          }
          var result = `<div>${params[0].name}</div>`;
          params.forEach(function(item) {
            result += `<div>
                              <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${
                                item.color
                              }"></span>
                              <span>${item.seriesName}:</span>
                              <span>${item.data || '--'}%</span>
                          </div>`;
          });
          return result;
        }
      },
      toolbox: { show: false },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        axisPointer: {
          snap: true,
          lineStyle: {
            color: '#ccc',
            opacity: 0.5,
            width: 2
          },
          handle: {
            show: true,
            color: '#A5B7CB'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#333'
          },
          rotate: 30,
          interval: 0
        },
        data: toJS(
          this.props.store.#{pageName}#.barSubCategoryData && this.props.store.#{pageName}#.barSubCategoryData[2]
        )
      },
      yAxis: {
        type: 'value',
        scale: true,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e5e5e5'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#333'
          },
          formatter: `{value}%`
        }
      },
      series: [
        {
          name: this.props.store.common.isDemo ? '品牌商' : '品牌商',
          type: 'bar',
          smooth: true,
          itemStyle: {
            normal: {
              color: '#616dd3'
            }
          },
          lineStyle: {
            normal: {
              color: '#616dd3'
            }
          },
          areaStyle: {
            normal: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0.5,
                  color: 'rgba(97, 109, 211, .3)'
                },
                {
                  offset: 1,
                  color: 'rgba(255, 255, 255, .2)'
                }
              ])
            }
          }
        }
      ]
    };
  }
  @computed
  get barCategoryData() {
    return [
      {
        name: this.props.store.common.isDemo ? '品牌商' : '品牌商',
        type: 'bar',
        data: toJS(
          this.props.store.#{pageName}#.barSubCategoryData &&
            this.props.store.#{pageName}#.barSubCategoryData[0].map(item => (item * 100).toFixed(2))
        )
      },
      {
        name: '品类',
        type: 'bar',
        data: toJS(
          this.props.store.#{pageName}#.barSubCategoryData &&
            this.props.store.#{pageName}#.barSubCategoryData[1].map(item => (item * 100).toFixed(2))
        )
      }
    ];
  }

  render() {
    const {
      store: { #{pageName}#, common }
    } = this.props;
    const tabs = [
      {
        title: '销售额'
      },
      {
        title: 'UV'
      },
      {
        title: 'UV转化率'
      },
      {
        title: '用户数'
      }
    ];
    const segmentedControlValues = ['UV', 'UV转化率', '用户同比增长率', '客单价'];

    return (
      <WingBlank size="sm">
        <WhiteSpace size="sm" />
        <Conditions onSearch={this.onSearch} showCategory showBrand showDate defaultValueType="7" />
        <WhiteSpace size="sm" />
        <Card>
          <Card.Header title="指标" />
          <Card.Body>
            <Tabs tabs={tabs} swipeable={false}>
              <div>
                <div className={styles.summaryItem}>
                  <div className={styles.num}>
                    {n`(${#{pageName}#}.summaryData.gmv / 10000).toFixed(2)`}
                    万元
                  </div>
                  <div className={`${styles.rates} clearfix`}>
                    <div className={`${n`${#{pageName}#}.summaryData.gmvYOY` > 0 ? styles.red : styles.green} fl`}>
                      <div>同比</div>
                      <div>
                        {n`${#{pageName}#}.summaryData.gmvYOY` > 0 ? '+' : ''}
                        {n`${#{pageName}#}.summaryData.gmvYOY`}%
                      </div>
                    </div>
                    <div className={`${n`${#{pageName}#}.summaryData.gmvYOY` > 0 ? styles.red : styles.green} fr`}>
                      <div>环比</div>
                      <div>
                        {n`${#{pageName}#}.summaryData.gmvMOM` > 0 ? '+' : ''}
                        {n`${#{pageName}#}.summaryData.gmvMOM`}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className={styles.summaryItem}>
                  <div className={styles.num}>{n`${#{pageName}#}.summaryData.uv`}</div>
                  <div className={`${styles.rates} clearfix`}>
                    <div className={`${n`${#{pageName}#}.summaryData.uvYOY` > 0 ? styles.red : styles.green} fl`}>
                      <div>同比</div>
                      <div>
                        {n`${#{pageName}#}.summaryData.uvYOY` > 0 ? '+' : ''}
                        {n`${#{pageName}#}.#{pageName}#.summaryData.uvYOY`}%
                      </div>
                    </div>
                    <div className={`${n`${#{pageName}#}.summaryData.uvMOM` > 0 ? styles.red : styles.green} fr`}>
                      <div>环比</div>
                      <div>
                        {n`${#{pageName}#}.summaryData.uvMOM` > 0 ? '+' : ''}
                        {n`${#{pageName}#}.summaryData.uvMOM`}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className={styles.summaryItem}>
                  <div className={styles.num}>{n`${#{pageName}#}.summaryData.uvRates`}%</div>
                  <div className={`${styles.rates} clearfix`}>
                    <div className={`${n`${#{pageName}#}.summaryData.uvRatesYOY` > 0 ? styles.red : styles.green} fl`}>
                      <div>同比</div>
                      <div>
                        {n`${#{pageName}#}.summaryData.uvRatesYOY` > 0 ? '+' : ''}
                        {n`${#{pageName}#}.summaryData.uvRatesYOY`}%
                      </div>
                    </div>
                    <div className={`${n`${#{pageName}#}.summaryData.uvRatesMOM` > 0 ? styles.red : styles.green} fr`}>
                      <div>环比</div>
                      <div>
                        {n`${#{pageName}#}.summaryData.uvRatesMOM` > 0 ? '+' : ''}
                        {n`${#{pageName}#}.summaryData.uvRatesMOM`}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className={styles.summaryItem}>
                  <div className={styles.num}>{n`${#{pageName}#}.summaryData.userCount`}</div>
                  <div className={`${styles.rates} clearfix`}>
                    <div
                      className={`${n`${#{pageName}#}.summaryData.userCountYOY` > 0 ? styles.red : styles.green} fl`}>
                      <div>同比</div>
                      <div>
                        {n`${#{pageName}#}.summaryData.userCountYOY` > 0 ? '+' : ''}
                        {n`${#{pageName}#}.summaryData.userCountYOY`}%
                      </div>
                    </div>
                    <div className={`${styles.red} fr`}>
                      <div>环比</div>
                      <div>
                        {n`${#{pageName}#}.summaryData.userCountMOM` > 0 ? '+' : ''}
                        {n`${#{pageName}#}.summaryData.userCountMOM`}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tabs>
          </Card.Body>
        </Card>
        <WhiteSpace size="sm" />
        <Card>
          <Card.Header title="整体指标" />
          <Card.Body>
            <div>
              <div className={styles.chartTit}>销售额趋势</div>
              <WhiteSpace size="lg" />
              <LineChart ref="ecSales" option={toJS(this.salesOptions)} data={toJS(this.salesData)} />
              <div className={styles.chartTit}>销售额同比增长率趋势</div>
              <WhiteSpace size="lg" />
              <LineChart ref="ecSalesRates" option={toJS(this.salesRatesOptions)} data={toJS(this.salesRatesData)} />
            </div>

            <div className={styles.chartTit}>增长驱动力趋势</div>
            <WhiteSpace size="lg" />
            <SegmentedControl
              values={segmentedControlValues}
              onChange={this.onGrowthTypeChange}
              selectedIndex={this.switchIndex}
              className="busi-eval-seg-longtext"
            />
            <WhiteSpace size="lg" />
            <LineChart ref="ecGrowth" option={toJS(this.growthOptions)} data={toJS(this.growthData)} />
          </Card.Body>
        </Card>
        <WhiteSpace size="sm" />
        <Card>
          <Card.Header title="下级品类对比" />
          <Card.Body>
            <if condition={#{pageName}#.showSubCategoryBlock}>
              <div className={styles.subCategoryBlock}>
                <div className={styles.chartTit}>销售额占比分布对比</div>
                <WhiteSpace size="lg" />
                <PieChart
                  ref="ecPieCategory"
                  option={toJS(this.pieCategoryOptions)}
                  data={toJS(this.pieCategoryData)}
                />

                <div className={styles.chartTit}>销售额增长率对比</div>
                <WhiteSpace size="lg" />
                <BarChart
                  ref="ecBarCategory"
                  option={toJS(this.barCategoryOptions)}
                  data={toJS(this.barCategoryData)}
                />
              </div>
            </if>
          </Card.Body>
        </Card>
      </WingBlank>
    );
  }
}
