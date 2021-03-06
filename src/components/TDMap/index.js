import styles from './index.less';
import React, { Component } from 'react';
import Cesium from 'cesium/Cesium';
import cesiumMap from './oc.cesium.js';
import 'cesium/Widgets/widgets.css';

let cesium_map = new cesiumMap.map();
let cesium_control = new cesiumMap.control();

class TDMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchLocData: '',
    };
  }

  componentDidMount() {
    // 初始化地球
    cesium_map.initMap('3d_map');
    // tk=fa6804bbb4f7ddb853e25d652be853ee'
    // 配置罗盘、比例尺和缩放控件
    let options = {};
    // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
    options.defaultResetView = Cesium.Rectangle.fromDegrees(80, 22, 130, 50);
    // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
    options.enableCompass = true;
    // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
    options.enableZoomControls = true;
    // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
    options.enableDistanceLegend = true;
    // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
    options.enableCompassOuterRing = true;
    cesium_control.initNavigation(options);
    cesium_control.mousePosition(document.getElementById('currentPosition'));
    let tiandituMapUrl = '/DataServer?T=img_w&x={x}&{x}&y={y}&l={z}&tk=b25c5f808773cc7465374cd017f2c91a';
    let annotationUrl = '/DataServer?T=eva_w&x={x}&{x}&y={y}&l={z}&tk=b25c5f808773cc7465374cd017f2c91a';
    // 加载天地图地图
    cesium_map.addTmsMapLayer({
      dataType: 'baseMap',
      layerName: 'tdtBaseLayer',
      url: tiandituMapUrl,
      alpha: 1,
    });
    // 加载天地图注记
    cesium_map.addTmsMapLayer({
      dataType: 'baseMap',
      layerName: 'annotationLayer',
      url: annotationUrl,
      alpha: 1,
    });
    let attr={  key:'111' , url:'/geoserver/ecology/wms' , layerName:"ecology:ecology_pacific", srs:'EPSG:4326' }
    cesium_map.addWmsMapLayer(attr);
    // 地图初始视角
    cesium_map.setView(136,37, 20000000);
  }

  render() {
    function sceneSwitch() {
      let cesium_control = new cesiumMap.control();
      let node = document.getElementById('sceneSwitcher');
      let mode = node.innerText;
      cesium_control.switchSceneMode(mode, node);
    }

    return (
      <div className={styles.normal}>
        <div id="3d_map" className={styles.fullScreen_3d}>
          <div className={styles.dimensionSwitcher}>
            <button id="sceneSwitcher" onClick={sceneSwitch}>2D</button>
          </div>
        </div>
        <div id="currentPosition"/>
      </div>);
  }
}

export default TDMap;
