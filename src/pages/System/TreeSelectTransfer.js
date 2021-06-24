import React, { Component } from 'react';
import {
  Tree,
  Checkbox,
  Button,
  Input,
  Icon,
  message
} from 'antd'

import styles from "./TreeSelectTransfer.less"

const { TreeNode } = Tree;

function toTree(data) {
  // 删除 所有 children,以防止多次调用
  data.forEach(function (item) {
    delete item.routes;
  });
  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
  let map = {};
  data.forEach((item) =>{
    map[item.id] = item;
  });
  let val = [];
  data.forEach((item)=>{
    //item.key = item.id;
    // 以当前遍历项的pid,去map对象中找到索引的id
    let parent = map[item.pid];
    // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
    if (parent) {
      (parent.children || ( parent.children = [] )).push(item);
    } else {
      //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
      val.push(item);
    }
  });
  return val;
}

let obj={};
function Traversing (data,rightDataList){
  for(let i=0;i<data.length;i++){
    for(let j=0;j<rightDataList.length;j++){
      if(data[i].id === rightDataList[j].id){
        //rightDataKey[j].key = data[i].key
        obj[data[i].key] = data[i].id
      }
      if(data[i].children){
        Traversing(data[i].children,rightDataList)
      }
    }
  }
  return obj
}

function array(data1,data2){
  let arr = [];
  for(let i=0;i<data1.length;i++){
    arr.push(data1[i])
  }
  for(let i=0;i<data2.length;i++){
    arr.push(data2[i])
  }
  return arr
}

function keyId(data,SelectKey){
  let leftObj ={};
  const traversing = (data)=> {
    for(let i=0;i<data.length;i++){
      for(let j=0;j<SelectKey.length;j++){
        if(data[i].key === SelectKey[j]){
          leftObj[data[i].key] = data[i].id
        }
        if(data[i].children){
          traversing(data[i].children)
        }
      }
    }
  }
  traversing(data); //将key变成{key:id}
  return leftObj
}

function unique (arr) {
  return Array.from(new Set(arr))
}

const splitSymbol = "-";

//给传进来的dataSource进行key的添加

const dataAddKey = (data,Pindex='') => {
  return data.map((item, index) => {
    item.key = Pindex+''+index;
    if(item.children){
      dataAddKey(item.children,`${item.key}${splitSymbol}`)
    }
    return item;
  })
}

//获取左边或右边的key
const getLeftAndRightKey = (data, rightDataKey) => {
  let len = data.length; //获取data的长度
  let rightData = new Array(len).fill("").map(() => {
    return { children: [] }
  });
  let leftData = new Array(len).fill("").map(() => {
    return { children: [] }
  });

  let leftTotalCount = 0;
  let rightTotalCount = 0;

  let new_data = JSON.parse(JSON.stringify(data)) //深拷贝


  function aaa(data,rightDataKey){
    data.children.map((item,index)=>{
      if(!(item.key in rightDataKey)){
        delete data.children[index]
      }else{
        if(data.children[index].children){
          aaa(data.children[index],rightDataKey)
        }
      }
    })
  }

  new_data.map((item, index) => {
    if(item.children){
      item.children.map((childItem, childIndex) => {
        if(childItem.key in rightDataKey) {
          rightData[index].name = item.name;
          rightData[index].key = item.key;
          rightData[index].children.push(childItem);
          if(rightData[index].children){
            rightData[index].children.map((sitem,sindex)=>{ //遍历第二层
              if(sitem.children){
                sitem.children.map((citem,cindex)=>{ //遍历第二层的子节点
                  if(!(citem.key in rightDataKey)) {
                    delete rightData[index].children[sindex].children[cindex]
                  }else{
                    if(rightData[index].children[sindex].children[cindex].children){
                      aaa(rightData[index].children[sindex].children[cindex],rightDataKey)
                    }
                  }
                })
              }
            })
          }
          rightTotalCount += 1;
        }
      })
    }
  });
  /*new_data.map((item, index) => {
    if(item.children){
      item.children.map((childItem, childIndex) => {
        if(childItem.key in rightDataKey) {
          rightData[index].name = item.name;
          rightData[index].key = item.key;
          rightData[index].children.push(childItem);
          if(rightData[index].children){
            rightData[index].children.map((sitem,sindex)=>{ //遍历第二层
              if(sitem.children){
                sitem.children.map((citem,cindex)=>{ //遍历第二层的子节点
                  if(!(citem.key in rightDataKey)) {
                    delete rightData[index].children[sindex].children[cindex]
                  }else{
                    if(rightData[index].children[sindex].children[cindex].children){
                      rightData[index].children[sindex].children[cindex].children.map((vitem,vindex)=>{
                        if(!(vitem.key in rightDataKey)){
                          delete rightData[index].children[sindex].children[cindex].children[vindex]
                        }else{
                          if(rightData[index].children[sindex].children[cindex].children[vindex].children){
                            rightData[index].children[sindex].children[cindex].children[vindex].children.map((pitem,pindex)=>{
                              if(!(pitem.key in rightDataKey)){
                                delete rightData[index].children[sindex].children[cindex].children[vindex].children[pindex]
                              }else{
                                if(rightData[index].children[sindex].children[cindex].children[vindex].children[pindex].children){
                                  rightData[index].children[sindex].children[cindex].children[vindex].children[pindex].children.map((yitem,yindex)=>{
                                    if(!(yitem.key in rightDataKey)){
                                      delete rightData[index].children[sindex].children[cindex].children[vindex].children[pindex].children[yindex]
                                    }else{
                                      if(rightData[index].children[sindex].children[cindex].children[vindex].children[pindex].children[yindex].children){
                                        rightData[index].children[sindex].children[cindex].children[vindex].children[pindex].children[yindex].children.map((litem,lindex)=>{
                                          if(!(litem.key in rightDataKey)){
                                            delete rightData[index].children[sindex].children[cindex].children[vindex].children[pindex].children[yindex].children[lindex]
                                          }else{
                                            message.error("最多7层",1.5,()=>{
                                              rightData[index] = {  }
                                            })
                                          }
                                        })
                                      }
                                    }
                                  })
                                }
                              }
                            })
                          }
                        }
                      })
                    }
                  }
                })
              }
            })
          }
          rightTotalCount += 1;
        }
      })
    }
  });*/
  rightData = rightData.filter(item => {
    return item.children.length
  })
  leftData = leftData.filter(item => {
    return item.children.length
  })
  return {
    leftData:data,
    rightData,
    leftTotalCount,
    rightTotalCount
  }
}

//筛选data
const filterData = (data, filterValue) => {
  let filterTrimV = filterValue.trim();
  if(!filterTrimV) {
    return data;
  }
  data = data.filter(item => {
    if(item.name.includes(filterTrimV)) {
      return true;
    } else if(item.children && item.children.length) {
      item.children = item.children.filter(childItem => {
        if(childItem.name.includes(filterTrimV)) {
          return true;
        } else {
          return false;
        }
      });
      return item.children.length > 0
    }
    return true;
  })
  return data;
}


class TreeSelectTransfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftSelectKey: {},
      rightDataKey: {},
      rightSelectKey: {},
      leftIptValue: '',
      rightIptValue: '',

      leftFValue: '',
      rightFValue: '',
      data:[],
      targetKeys: [],
      parentKey:[],
      parentKeyIds:[]
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource != this.props.dataSource) {
      this.setState({
        leftSelectKey: {},
        rightDataKey: {},
        rightSelectKey: {},
        leftIptValue: '',
        rightIptValue: '',
        leftFValue: '',
        rightFValue: '',
        targetKeys: [],
      });
    } else if (this.state.targetKeys == this.props.targetKeys) {
      return false;
    }
    return true;
  }


  //点击树节点触发
  bindChange = (type, data) => (e, item) => {
    let selectKeyO = { ...this.state[type] };
    const eventKey = item.node.props.eventKey; //获取当前点击项的key
    const findSplitSymbol = eventKey.indexOf(splitSymbol) > -1; //true为顶级节点
    if (!findSplitSymbol) { //为顶级节点的时候触发
      let notSelectA = [];
      let selectA = [];
      if (!data[eventKey]) {
        return;
      }
      let dataChildren = data[eventKey] ? data[eventKey].children : [];
      dataChildren.map(({ id, key }) => {
        // let nowKey = `${eventKey}${splitSymbol}${index}`;
        let nowKey = key;
        if (!(nowKey in selectKeyO)) {
          notSelectA.push({
            key: nowKey,
            title: id,
          });
        } else {
          selectA.push(nowKey);
        }
      });

      if (notSelectA.length) {
        notSelectA.map(({ key, title }) => {
          selectKeyO[key] = title;
        });
      } else {
        selectA.map(key => {
          delete selectKeyO[key];
        });
      }
    } else {
      const id = item.node.props.id;
      if (eventKey in selectKeyO) {
        delete selectKeyO[eventKey];
      } else {
        selectKeyO[eventKey] = id;
      }
    }
    this.setState({
      [type]: selectKeyO,
    });
  };

  //左右边checkbox选中时触发
  selectOrCancelAll = (type, selectKeys, data, isSelectAll) => () => {
    if (isSelectAll) {
      this.setState({
        [type]: {},
      });
    } else {
      let newSelectKeys = { ...selectKeys };
      data.map(item => {
        item.children.map(childItem => {
          if (!(childItem.key in newSelectKeys)) {
            newSelectKeys[childItem.key] = childItem.id;
          }
        });
      });
      this.setState({
        [type]: newSelectKeys,
      });
    }
  };

  selectGoToRight = () => {
    const { onChange,dataList } = this.props;
    const { data,parentKey } = this.state;

    let leftSelectKey = this.state.leftSelectKey; //左边选中的key
    const keyValue = keyId(data,leftSelectKey) //返回点击节点的{key:id}
    const parentKeys = keyId(data,parentKey)

    let rightDataKey = this.state.rightDataKey; //右边原有的key
    rightDataKey = { ...rightDataKey, ...keyValue,...parentKeys }; //合成新的key给右边
    let targetKeys = Object.values(rightDataKey); //从右边的key中取出id放入targetKeys
    let parentKeyIds = Object.values(parentKeys);
    this.setState({
      leftSelectKey: {},
      rightSelectKey:{},
      rightDataKey,
      targetKeys,
      parentKeyIds,
    });
    if (typeof onChange == 'function') {
      const arrayConcat = array(targetKeys,parentKeyIds);
      onChange(unique(arrayConcat));
    }
  };
  /*selectGoToLeft = () => {
    const { onChange,dataList } = this.props;
    const { data } = this.state;
    /!*let rightObj ={}; //右边key:id 集合
    let rightSelectKey = this.state.rightSelectKey;
    const traversing = (data)=> {
      for(let i=0;i<data.length;i++){
        for(let j=0;j<rightSelectKey.length;j++){
          if(data[i].key === rightSelectKey[j]){
            rightObj[data[i].key] = data[i].id
          }
          if(data[i].children){
            traversing(data[i].children)
          }
        }
      }
    }
    traversing(data); //将key变成{key:id}*!/
    let rightDataKey = { ...this.state.rightDataKey }; //右边所有key的集合
    let parentKey = { ...this.state.parentKey }; //右边选中的所有数据的父key集合
    const keyValue = keyId(data,rightDataKey); //返回点击节点的{key:id}
    const parentKeys = keyId(data,parentKey); //返回点击节点的上级节点的{key:id}
    for (let key in keyValue) {
      delete rightDataKey[key];  //删除点击当前节点的key
    }
    for (let key in parentKeys) {
      delete parentKey[key]; //删除父节的key
    }
    let targetKeys = Object.values(rightDataKey); //取出当前节点的di集合
    let parentKeyIds = Object.values(parentKeys); //取出当前节点所有父节点的id集合

    this.setState({
      leftSelectKey: {},
      rightSelectKey:{},
      rightDataKey,
      targetKeys,
      parentKeyIds
    });
    if (typeof onChange == 'function') {
      const arrayConcat = array(targetKeys,parentKeyIds)
      onChange(unique(arrayConcat));
    }
  };*/
  selectGoToLeft = () => {
    //console.log("原有",this.state.rightDataKey)
    const { onChange } = this.props;
    const { data,pidLists } = this.state;

    let rightSelectKey = this.state.rightSelectKey;
    const KeyIds = keyId(data,rightSelectKey);

    let rightDataKey = { ...this.state.rightDataKey };
    for (let key in KeyIds) {
      delete rightDataKey[key];
    }
    let targetKeys = Object.values(rightDataKey);
    this.setState({
      leftSelectKey: {},
      rightSelectKey:{},
      rightDataKey,
      targetKeys,
    });
    if (typeof onChange == 'function') {
      onChange(targetKeys);
    }
  };
  //右边输入框查询
  changeIptValue = (type) => (event) => {
    this.setState({
      [type]: event.target.value,
    });
  };
  //左边输入框查询
  begineSearch = (type) => () => {
    if (type == 'left') {
      this.setState({
        leftFValue: this.state.leftIptValue,
      });
    } else {
      this.setState({
        rightFValue: this.state.rightIptValue,
      });
    }
  };

  clearSearchAndValue = (type) => () => {
    if (type == 'left') {
      this.setState({
        leftIptValue: '',
        leftFValue: '',
      });
    } else {
      this.setState({
        rightIptValue: '',
        rightFValue: '',
      });
    }
  };

  componentWillReceiveProps(nextProps) {
    if(nextProps.rightDataList != this.props.rightDataList){
      const { rightDataList,dataSource } = nextProps;
      const {onChange}=this.props;
      let data = dataAddKey(dataSource);
      const a = Traversing(data,rightDataList);
      this.setState({
        rightDataKey:a,
        data,
      })
      obj ={};
      let targetKeys = Object.values(a);
      onChange(targetKeys)
    }
  }



  renderTreeNodes = (data) =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={item.name}
            key={item.key}
            dataRef={item}
            id={item.id}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} id={item.id} key={item.key} dataRef={item} />
    });

  onCheck = (checkedKeys,e,type) => {
    if(type === 'leftSelectKey'){
      this.setState({
        leftSelectKey:checkedKeys,
        parentKey:e.halfCheckedKeys
      });
    }
    if(type === 'rightSelectKey'){
      this.setState({
        rightSelectKey:checkedKeys,
        parentKey:e.halfCheckedKeys
      });
    }
  };

  render() {
    const {
      leftSelectKey,
      rightDataKey,
      rightSelectKey,
      leftIptValue,
      rightIptValue,
      leftFValue = '',
      rightFValue = '',
    } = this.state;
    const {
      dataSource = [],
      titles = [],
    } = this.props;
    let data = dataAddKey(dataSource);
    let leftSelectCount = Object.keys(leftSelectKey).length;
    let rightSelectCount = Object.keys(rightSelectKey).length;
    let isHaveLeftChecked = leftSelectCount > 0;
    let isHaveRightChecked = rightSelectCount > 0;
    let {
      leftData,
      rightData,
      leftTotalCount,
      rightTotalCount,
    } = getLeftAndRightKey(data, rightDataKey);
    const fLeftData = filterData(leftData, leftFValue);
    const fRightData = filterData(rightData, rightFValue);
    let leftSelectAll = leftSelectCount == leftTotalCount;
    let rightSelectAll = rightSelectCount == rightTotalCount;
    return (
      <div className={styles['tree-select-transfer']}>
        <div className="tst-l">
          <div className="tst-header" style={{display:'flex',justifyContent:'center'}}>
            {/*{leftTotalCount ?
              <Checkbox
                indeterminate={!leftSelectAll && isHaveLeftChecked}
                checked={leftSelectAll}
                onChange={this.selectOrCancelAll('leftSelectKey', leftSelectKey, leftData, leftSelectAll)}
              >
                {`${leftSelectCount ? leftSelectCount + '/' : ''}${leftTotalCount} 条`}
              </Checkbox> : null
            }*/}
            {titles[0] ? <span style={{ float: 'right' }}>{titles[0]}</span> : null}
          </div>
          <Input
            placeholder="请输入搜索内容, 输入完按Enter键过滤"
            value={leftIptValue}
            onChange={this.changeIptValue('leftIptValue')}
            style={{ width: '100%', padding: 4 }}
            suffix={leftIptValue ?
              <Icon type="close-circle" theme="filled" onClick={this.clearSearchAndValue('left')}/>
              :
              <Icon type="search" onClick={this.begineSearch('left')}/>
            }
            onPressEnter={this.begineSearch('left')}
          />
          <div style={{ overflow: 'auto', height: 220 }}>
            <Tree
              checkable
              switcherIcon={<Icon type="down"/>}
              checkedKeys={leftSelectKey}
              onCheck={(checkedKeys,e)=>this.onCheck(checkedKeys,e,'leftSelectKey')}
            >
              {this.renderTreeNodes(fLeftData)}
            </Tree>
          </div>
        </div>
        <div className="tst-m">
          <Button
            type="primary"
            size="small"
            icon="right"
            style={{ marginBottom: 4 }}
            disabled={!isHaveLeftChecked}
            onClick={this.selectGoToRight}
          >

          </Button>
          <Button
            type="primary"
            size="small"
            disabled={!isHaveRightChecked}
            icon="left"
            onClick={this.selectGoToLeft}
          >

          </Button>
        </div>
        <div className="tst-l">
          <div className="tst-header" style={{display:'flex',justifyContent:'center'}}>
            {/*{rightTotalCount ?
              <Checkbox
                indeterminate={!rightSelectAll && isHaveRightChecked}
                checked={rightSelectAll}
                onChange={this.selectOrCancelAll('rightSelectKey', rightSelectKey, rightData, rightSelectAll)}
              >
                {`${rightSelectCount ? rightSelectCount + '/' : ''}${rightTotalCount} 条`}
              </Checkbox> : null
            }*/}
            {titles[1] ? <span style={{ float: 'right' }}>{titles[1]}</span> : null}
          </div>
          <Input
            placeholder="请输入搜索内容, 输入完按Enter键过滤"
            onChange={this.changeIptValue('rightIptValue')}
            value={rightIptValue}
            style={{ width: '100%', padding: 4 }}
            suffix={
              rightIptValue ?
                <Icon type="close-circle" theme="filled" onClick={this.clearSearchAndValue('right')}/> :
                <Icon type="search" onClick={this.begineSearch('right')}/>
            }
            onPressEnter={this.begineSearch('right')}
          />
          <div style={{ overflow: 'auto', height: 220 }}>
            <Tree
              checkable
              defaultExpandAll
              switcherIcon={<Icon type="down"/>}
              checkedKeys={rightSelectKey}
              onCheck={(checkedKeys,e)=>this.onCheck(checkedKeys,e,'rightSelectKey')}
            >
              {
                /*fRightData?fRightData.map((item, index) => {
                  if (item.children && item.children.length) {
                    return <TreeNode title={item.name} key={index}>
                      {
                        item.children.map((childItem) => {
                          let isChecked = childItem.key in rightSelectKey;
                          return <TreeNode
                            icon={
                              <Checkbox checked={isChecked}/>
                            }
                            id={childItem.id}
                            onClick={this.bindChange}
                            key={childItem.key}
                            title={childItem.name}
                          />;
                        })
                      }
                    </TreeNode>;
                  }
                }):''*/
                this.renderTreeNodes(fRightData)
              }
            </Tree>

          </div>
        </div>
      </div>
    );
  }
}

export default TreeSelectTransfer;
