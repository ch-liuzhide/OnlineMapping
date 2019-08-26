import React, { PureComponent } from 'react';
import styles from './index.less';
import classNames from 'classnames';
import { connect } from 'dva';
import { IconFont } from '@/utils/common';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  Anchor,
  Tabs,
  Tree,
  Card,
  DatePicker,
  Timeline,
  Select,
  List,
  Input,
  Icon,
  Spin,
} from 'antd';

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const { link } = Anchor;
const IconText = ({ type, handleClick }) => (
  <span>
    <Icon type={type} onClick={handleClick}/>
  </span>
);

const yearNodes = ['2019', '2018'];

const themeNodes = {
  '2019': ['叶绿素', '海洋'],
  '2018': ['生态', '海洋'],
  'all': ['生态', '叶绿素', '海洋'],
};

const dataNodes = {
  '2019': [{ name: '叶绿素', children: ['2019叶绿素1', '2019叶绿素2'] },
    { name: '海洋', children: ['2019海洋1'] }],
  '2018': [{ name: '海洋', children: ['2018海洋1', '2018海洋2'] },
    { name: '生态', children: ['2018生态1', '2018生态2'] }],
  'all': [{ name: '叶绿素', children: ['2019叶绿素1', '2019叶绿素2'] },
    { name: '海洋', children: ['2019海洋1'] },
    { name: '生态', children: ['2018生态1', '2018生态2'] }],
};

@connect(({ mapView, loading }) => ({
  fetchDataLoading: loading.effects['mapView/fetchDataset'],
  fetchLayerLoading: loading.effects['mapView/fetchLayer'],
  mapView,
}))
class DataTabs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      requireDataQuery: { length: 10 },
      searchQuery: { length: 10 },
      searchValue: '',
      themeOfYear: themeNodes['all'],
      datas: null,
      dataOfTheme: dataNodes['all'],
      currentPageDataset: 1,
      currentPageLayer: 1,
      activeKey: '1',
      layerList: [],
    };
  }

  searchByQuery = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mapView/fetchDataset',
      payload: this.state.searchQuery,
    });
  };

  nodeOnSelect = (keys, event) => {
    let temp = this.state.requireDataQuery;
    temp['data'] = event.node.props.title;
    if (event) {
      this.setState({ requireDataQuery: temp });
    }
  };

  themeOnSearch = value => {
    let temp = this.state.searchQuery;
    console.log(value);
    if (value) {
      temp['tag1'] = value;
      this.setState({
        searchQuery: temp,
      });
      console.log('search', this.state.searchQuery);
      const { dispatch } = this.props;
      dispatch({
        type: 'mapView/fetchDataset',
        payload: this.state.searchQuery,
      });
    }
  };

  selectYear = (keys, event) => {
    let temp = event.node.props.title;
    if (temp) {
      this.setState({
        themeOfYear: themeNodes[temp],
        dataOfYear: dataNodes[temp],
      });
    }
  };

  yearOnSearch = value => {
    let temp = this.state.searchQuery;
    console.log(value);
    if (value) {
      temp['tag2'] = value;
      this.setState({
        searchQuery: temp,
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'mapView/fetchDataset',
        payload: this.state.searchQuery,
      });
    }
  };

  //List分页异步查询
  handlePaginationChange1 = (value) => {
    let temp = this.state.searchQuery;
    temp['start'] = 10 * (value - 1);
    temp['length'] = 10;
    this.setState({
      currentPageDataset: value,
      searchQuery: temp,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'mapView/fetchDataset',
      payload: this.state.searchQuery,
    });
  };

  //List分页异步查询
  handlePaginationChange2 = (value) => {
    let temp = this.state.searchQuery;
    this.setState({
      currentPageLayer: value,
      searchQuery: temp,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'mapView/fetchLayer',
      payload: this.state.searchQuery,
    });
  };

  goToThirdTab = e => {
    if (e) {
      let idd = e.target.id;
      let temp = this.state.searchQuery;
      temp['datasetId'] = idd;
      this.setState({
        activeKey: '3',
        searchQuery: temp,
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'mapView/fetchLayer',
        payload: this.state.searchQuery,
      });
    }
  };

  tabOnChange = activeKey => {
    this.setState({
      activeKey: activeKey,
    });
  };

  render() {
    //控制Leftpanel是否显示；控制Leftpanel关闭；model层；数据列表加载状态
    const { visible, handleClose, mapView, fetchDataLoading = false, fetchLayerLoading = false } = this.props;
    const { TreeNode } = Tree;
    const { dataSetList } = mapView;
    const { layerList } = mapView;
    let searchInput = this.state.searchValue;
    let th = this.state.themeOfYear;
    let da = this.state.dataOfTheme;
    console.log(da);
    //数据展示列表
    let productsList = [];
    if (dataSetList.totalCount > 0) {
      productsList = dataSetList.datasets;
    }
    let layersssList = layerList.layers;
    return (
      <div className={classNames(styles['card-container'], { [styles['card-container-show']]: visible })}>
        <Tabs type="card"
              activeKey={this.state.activeKey}
              onChange={this.tabOnChange}
              tabBarExtraContent={<div className="icons-list" id="tab_close" title="Hide">
                <IconFont type="icon-eyeoff" style={{ fontSize: 24 }} onClick={handleClose}/>
              </div>}>
          <TabPane tab="Catalog" key="1">
            <Timeline>
              <Timeline.Item>
                <div className={styles.timeline_content}>
                  <h2>2018年报数据</h2>
                  <Tree style={{ float: 'left', display: 'inline' }} onSelect={this.nodeOnSelect}>
                    {th.map((item1) => {
                      let ff = da.find(item2 => item2.name == item1);
                      return <TreeNode title={item1}>
                        {
                          ff.children.map((item3) => {
                            return <TreeNode title={item3}></TreeNode>;
                          })
                        }</TreeNode>;
                    })
                    }
                  </Tree>
                </div>
              </Timeline.Item>
              <Timeline.Item>
                <div className={styles.timeline_content}>
                  <h2 >2019年报数据</h2>
                  <Tree style={{ float: 'left', display: 'inline' }} onSelect={this.nodeOnSelect}>
                    {th.map((item1) => {
                      let ff = da.find(item2 => item2.name == item1);
                      return <TreeNode title={item1}>
                        {
                          ff.children.map((item3) => {
                            return <TreeNode title={item3}></TreeNode>;
                          })
                        }</TreeNode>;
                    })
                    }
                  </Tree>
                </div>
              </Timeline.Item>
            </Timeline>
          </TabPane>
          <TabPane tab="Search" key="2">
            <div className={styles.searchCard}>
              <Select defaultValue="choose year" style={{ width: '150px' }} onChange={this.yearOnSearch}>
                <Option value="2018">
                  2018
                </Option>
                <Option value="2017">
                  2017
                </Option>
                <Option value="2016">
                  2016
                </Option>
              </Select>
              <Search
                placeholder="input search text"
                style={{ width: '90%', marginTop: '15px' }} onSearch={this.themeOnSearch}
              />
              {/*<Button type="primary" icon="search" onClick={this.searchByQuery}>Search</Button>*/}
            </div>
            <Scrollbars className={styles.productList}>
              {/*首次打开默认不检索，无数据时不显示list组件，数据请求时显示加载中状态*/}
              <Spin spinning={fetchDataLoading}>
                {productsList.length > 0 ?
                  <List
                    itemLayout="vertical"
                    dataSource={productsList}
                    // 控制分页，每页十条数据，异步请求数据
                    pagination={{
                      onChange: this.handlePaginationChange1,
                      pageSize: 10,
                      total: dataSetList.totalCount,
                      current: this.state.currentPageDataset,
                    }}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          //数据名称，太长时超出部分用省略号表示
                          id={item.id}
                          title={
                            <p
                              id={item.id}
                              onClick={this.goToThirdTab}>{item.name}</p>}
                          // 数据描述信息
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  /> : <div className={styles.search_bg}>
                    No Data
                  </div>
                }
              </Spin>
            </Scrollbars>
          </TabPane>
          <TabPane tab="Dataset" key="3">
            <div style={{ height: '63vh' }}>
              {/*<Card className={styles.resultCard}>*/}
              <Scrollbars className={styles.productList}>
                {/*首次打开默认不检索，无数据时不显示list组件，数据请求时显示加载中状态*/}
                <Spin spinning={fetchLayerLoading}>
                  <List
                    itemLayout="vertical"
                    dataSource={layersssList}
                    // 控制分页，每页十条数据，异步请求数据
                    pagination={layersssList && layersssList.length > 0 ?{
                      onChange: this.handlePaginationChange2,
                      pageSize: 10,
                      current: this.state.currentPageLayer,
                    }:false}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          //数据名称，太长时超出部分用省略号表示
                          title={item.layerName}
                          // 数据描述信息
                          description={item.dimensionValue}
                        />
                      </List.Item>
                    )}
                  />
                </Spin>
              </Scrollbars>
            </div>
          </TabPane>
        </Tabs>

      </div>
    );
  }
}

export default DataTabs;
