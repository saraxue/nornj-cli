import * as React from 'react';
import { Component, PropTypes } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import { Icon } from 'antd';

@inject('store')
@observer
export default class Sider extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.props.store.sider.history = props.history;
  }

  componentDidMount() {
    this.props.store.sider.setMenu(true);
  }

  selectMenu = index => {
    return e => {
      this.props.store.sider.setCurrent(index);
    };
  };

  toggleMenu = item => {
    return e => {
      this.props.store.sider.setMenuDataByIndex(!item.expanded, item.index);
    };
  };

  isMenuOpen = state => {
    this.props.store.sider.setMenu(state.isOpen);
  };

  render() {
    const { store } = this.props;

    const generateMenu = items =>
      items.map(item => (
        <If condition={item.type == 'item'}>
          <Link
            key={item.index}
            to={item.link}
            onClick={this.selectMenu(item.index)}
            className={`menu-item ${store.sider.current.toLowerCase() == item.index.toLowerCase() ? 'cur' : ''}`}>
            {item.name}
          </Link>
          <Elseif condition={item.type == 'group'}>
            <div key={item.name} className="menu-group">
              <div className="menu-tit" onClick={this.toggleMenu(item)}>
                <Icon type="book" style={{ marginRight: 3 }} />
                {item.name}
              </div>
              <div
                className={`menu-cnt ${item.expanded ? 'expanded' : ''}`}
                style={{ height: item.expanded ? item.children.length * 40 : 0 }}>
                {generateMenu(item.children)}
              </div>
            </div>
          </Elseif>
        </If>
      ));

    const menuCnt = generateMenu(store.sider.currentMenuData);
    return (
      <Menu
        pageWrapId="page-wrap"
        outerContainerId="outer-container"
        onStateChange={this.isMenuOpen}
        isOpen={store.sider.isOpen}
        width={200}
        noOverlay>
        <style jsx global>{`
          .bm-menu-wrap {
            z-index: 102 !important;
          }

          .site-logo {
            background-color: #3bbabb;
            height: 80px;
            line-height: 80px;
            font-size: 18px;
            color: #fff;
            padding-left: 28px;
            position: absolute;
            width: 100%;
            top: 0;
            left: 0;
          }

          .site-menu-tit {
            height: 60px;
            line-height: 60px;
            color: #cfd0d0;
            padding-left: 30px;
            border-bottom: 1px solid #4e5169;
            position: absolute;
            top: 80px;
            left: 0;
            width: 100%;
            background: #1b3149;
          }

          .site-menu-cnt {
            height: 100%;
            overflow: auto;
            padding-top: 140px;
          }

          /* Position and sizing of burger button */
          .bm-burger-button {
            position: fixed;
            z-index: 101 !important;
            width: 30px;
            height: 24px;
            left: 20px;
            top: 20px;
          }

          /* Color/shape of burger icon bars */
          .bm-burger-bars {
            background: #373a47;
          }

          /* Position and sizing of clickable cross button */
          .bm-cross-button {
            height: 29px !important;
            width: 29px !important;
            top: 97px !important;
            background: url(${require('../../images/btn-close-menu.png')}) no-repeat;

            .bm-cross {
              display: none;
            }
          }

          /* Color/shape of close button cross */
          .bm-cross {
            background: #bdc3c7;
          }

          /* General sidebar styles */
          .bm-menu {
            background: #1b3149;
            font-size: 1.15em;
          }

          /* Morph shape necessary with bubble or elastic */
          .bm-morph-shape {
            fill: #373a47;
          }

          /* Wrapper for item list */
          .bm-item-list {
            color: #b8b7ad;

            a {
              color: #6f7082;
              display: block;
              font-size: 14px;
              height: 40px;
              line-height: 40px;
              transition: all 0.5s;
              text-align: center;

              &:hover {
                text-decoration: none;
                color: #fff;
                background: #1f3750;
              }
            }

            a.cur {
              color: #fff;
              background: #1f3750;
            }

            .menu-group {
              cursor: pointer;
            }

            .menu-tit {
              border-bottom: 1px solid #4e5169;
              color: #777889;
              padding: 0.2rem;
              padding: 20px 30px;
              transition: all 0.5s;
              &:hover {
                text-decoration: none;
                color: #fff;
                background: #1b3149;
              }
              &:after {
                content: '';
                display: table;
                clear: both;
              }
            }

            .icon {
              display: inline-block;
              width: 22px;
              height: 22px;
              margin-right: 5px;
              float: left;
              background-position: center;
              background-repeat: no-repeat;
            }

            // .menu-group:nth-child(1) {
            //   .icon { background-image: url(../../images/icon-m1.png);}
            // }
            // .menu-group:nth-child(2) {
            //   .icon { background-image: url(../../images/icon-m2.png); }
            // }
            // .menu-group:nth-child(3) {
            //   .icon { background-image: url(../../images/icon-m3.png); }
            // }
            // .menu-group:nth-child(4) {
            //   .icon { background-image: url(../../images/icon-m8.png); }
            // }
            // .menu-group:nth-child(5) {
            //   .icon { background-image: url(../../images/icon-m4.png); }
            // }
            // .menu-group:nth-child(6) {
            //   .icon { background-image: url(../../images/icon-m5.png); }
            // }
            // .menu-group:nth-child(7) {
            //   .icon { background-image: url(../../images/icon-m8.png); }
            // }
            // .menu-group:nth-child(8) {
            //   .icon { background-image: url(../../images/icon-m7.png); }
            // }
          }

          .menu-cnt {
            background: #1b3149;
            transition: all 0.3s ease-out;
            overflow: hidden;
            height: 0;
            a:last-child {
              border-bottom: 1px solid #4e5169;
            }
          }

          .menu-cnt.expanded {
          }

          /* Styling of overlay */
          .bm-overlay {
            background: rgba(0, 0, 0, 0.3);
          }
        `}</style>
        <div className="site-logo">
          <div className="page-logo" />
        </div>
        <div className="site-menu-tit" />
        <div className="site-menu-cnt">{menuCnt}</div>
      </Menu>
    );
  }
}
