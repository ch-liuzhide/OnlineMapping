import React from 'react'
import {Button,Menu,Dropdown,Icon} from 'antd';
import { Grid, Row, Col } from 'react-flexbox-grid';
import DatasetCard from '@/components/DatasetCard';

function handleMenuClick(e) {
  console.log('click', e);
}

function ThemeCard({data}) {
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">unabridged version</Menu.Item>
      <Menu.Item key="2">全本</Menu.Item>
      <Menu.Item key="3">abridged version</Menu.Item>
      <Menu.Item key="4">简本</Menu.Item>
    </Menu>
  );
  return (
    <div style={{padding:'5px',height:'100%'}}>
      <div style={{padding:'5px',fontSize:'18px',textAlign:'center'}}>
        <img src={data.imgSrc} style={{width:'100%'}}/>
      </div>
      <div style={{fontSize:'18px',textAlign:'center',height:'82px'}}>
        <p style={{fontWeight:'bold'}}>{data.title}</p>
      </div>
      <div className={'downloadArea'} style={{textAlign:'center'}}>
        <Button type="primary" icon='eye' ghost>
          View data on map
        </Button>
        <Dropdown overlay={menu}>
          <Button>
            View report <Icon type="down" />
          </Button>
        </Dropdown>
      </div>
    </div>
  );
}

function ThemeCardList({dataSource}) {
  return (
    <div>
      <Row>
        {dataSource.map((item) => <Col xs><ThemeCard data={item}/></Col>)}
      </Row>
    </div>
  );
}

export default ThemeCardList;
