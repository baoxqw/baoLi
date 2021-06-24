import React, { Component } from 'react';
import {
  Tree,
  Checkbox,
  Button,
  Input,
  Icon
} from 'antd'

import styles from "./TreeSelectTransfer.less"

const { TreeNode } = Tree;

const splitSymbol = "-";

//给传进来的dataSource进行key的添加
const dataAddKey = (data) => {
  return data.map((item, index) => {
    item.key = index + "";
    if(item.children){
      item.children = item.children.map((childItem, childIndex) => {
        let nowKey = `${index}${splitSymbol}${childIndex}`;
        childItem.key = nowKey;
        return childItem;
      })
    }
    return item;
  })
}

//获取左边或右边的key
const getLeftAndRightKey = (data, rightDataKey = {}) => {
  let len = data.length; //获取data的长度
  let leftData = new Array(len).fill("").map(() => {
    return { children: []}
  });
  console.log('leftData',leftData)
  let rightData = new Array(len).fill("").map(() => {
    return { children: [] }
  });
  let leftTotalCount = 0;
  let rightTotalCount = 0;
  data.map((item, index) => {
    if(item.children){
      item.children.map((childItem, childIndex) => {
        let nowKey = `${index}${splitSymbol}${childIndex}`;
        if(nowKey in rightDataKey) {
          rightData[index].name = item.name;
          rightData[index].key = index + "";
          rightData[index].children.push(childItem);
          rightTotalCount += 1;
        } else {
          leftTotalCount += 1;
          leftData[index].name = item.name;
          leftData[index].key = index + "";
          leftData[index].children.push(childItem);
        }

      })
    }
  });
  leftData = leftData.filter(item => {
    return item.children.length
  })
  console.log('leftData',leftData)
  rightData = rightData.filter(item => {
    return item.children.length
  })

  return {
    leftData,
    rightData,
    leftTotalCount,
    rightTotalCount
  }
}

//筛选data
const filterData = (data, filterValue) => {
  console.log('data',data)
  console.log('v',filterValue)
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
  console.log("最后",data)
  return data;
}

class TreeSelectTransfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftSelectKey: {},
      rightDataKey: {},
      rightSelectKey: {},
      leftIptValue: "",
      rightIptValue: "",

      leftFValue: "",
      rightFValue: "",

      targetKeys: [],
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.dataSource != this.props.dataSource) {
      this.setState({
        leftSelectKey: {},
        rightDataKey: {},
        rightSelectKey: {},
        leftIptValue: "",
        rightIptValue: "",
        leftFValue: "",
        rightFValue: "",
        targetKeys: [],
      })
    } else if(this.state.targetKeys == this.props.targetKeys) {
      return false;
    }
    return true;
  }

  //点击树节点触发
  bindChange = (type, data) => (e, item) => {
    console.log(type,data)
    let selectKeyO = { ...this.state[type] };
    const eventKey = item.node.props.eventKey;
    const findSplitSymbol = eventKey.indexOf(splitSymbol) > -1;
    if(!findSplitSymbol) {
      let notSelectA = [];
      let selectA = [];
      if(!data[eventKey]) {
        return ;
      }
      let dataChildren = data[eventKey] ? data[eventKey].children : [];
      dataChildren.map(({ id, key }) => {
        // let nowKey = `${eventKey}${splitSymbol}${index}`;
        let nowKey = key;
        if(!(nowKey in selectKeyO)) {
          notSelectA.push({
            key: nowKey,
            title: id
          })
        } else {
          selectA.push(nowKey)
        }
      })
      if(notSelectA.length) {
        notSelectA.map(({key, title}) => {
          selectKeyO[key] = title;
        })
      } else {
        selectA.map(key => {
          delete selectKeyO[key];
        })
      }
    } else {
      const id = item.node.props.id;
      if(eventKey in selectKeyO) {
        delete selectKeyO[eventKey]
      } else {
        selectKeyO[eventKey] = id;
      }

    }
    this.setState({
      [type]: selectKeyO,
    })
  }

  //左右边checkbox选中时触发
  selectOrCancelAll = (type, selectKeys, data, isSelectAll) => () => {
    if(isSelectAll) {
      this.setState({
        [type]: {}
      })
    } else {
      let newSelectKeys = { ...selectKeys };
      data.map(item => {
        item.children.map(childItem => {
          if( !(childItem.key in newSelectKeys) ) {
            newSelectKeys[childItem.key] = childItem.id;
          }
        })
      })
      this.setState({
        [type]: newSelectKeys
      })
    }

  }

  selectGoToRight = () => {
    const { onChange,onObj } = this.props;
    let leftSelectKey = this.state.leftSelectKey;
    let rightDataKey = this.state.rightDataKey;
    rightDataKey = { ...rightDataKey, ...leftSelectKey };
    let targetKeys = Object.values(rightDataKey);
    this.setState({
      leftSelectKey: {},
      rightDataKey,
      targetKeys,
    })
    if(typeof onChange == "function") {
      onChange(targetKeys)
    }
    onObj(rightDataKey)
  }
  selectGoToLeft = () => {
    const { onChange,onObj } = this.props;
    let rightSelectKey = this.state.rightSelectKey;
    let rightDataKey = { ...this.state.rightDataKey };
    for(let key in rightSelectKey) {
      delete rightDataKey[key];
    }
    let targetKeys = Object.values(rightDataKey);
    this.setState({
      rightDataKey,
      rightSelectKey: {},
      targetKeys
    })
    if(typeof onChange == "function") {
      onChange(targetKeys)
    }
    onObj(rightDataKey)
  }

  //右边输入框查询
  changeIptValue = (type) => (event) => {
    this.setState({
      [type]: event.target.value
    })
  }
  //左边输入框查询
  begineSearch = (type) => () => {
    if(type == "left") {
      this.setState({
        leftFValue: this.state.leftIptValue
      })
    } else {
      this.setState({
        rightFValue: this.state.rightIptValue
      })
    }
  }

  clearSearchAndValue = (type) => () => {
    if(type == "left") {
      this.setState({
        leftIptValue: "",
        leftFValue: "",
      })
    } else {
      this.setState({
        rightIptValue: "",
        rightFValue: "",
      })
    }
  }

  render() {
    const {
      leftSelectKey,
      rightDataKey,
      rightSelectKey,
      leftIptValue,
      rightIptValue,
      leftFValue = "",
      rightFValue = "",
    } = this.state;
    const {
      dataSource = [],
      titles = [],
    } = this.props;
    console.log("dataSource",dataSource)
    let data = dataAddKey(dataSource);
    console.log("dddddd",data)
    let leftSelectCount = Object.keys(leftSelectKey).length;
    let rightSelectCount = Object.keys(rightSelectKey).length;
    let isHaveLeftChecked = leftSelectCount > 0;
    let isHaveRightChecked = rightSelectCount > 0;
    let {
      leftData,
      rightData,
      leftTotalCount,
      rightTotalCount
    } = getLeftAndRightKey(data, rightDataKey);
    const fLeftData = filterData(leftData, leftFValue);
    const fRightData = filterData(rightData, rightFValue);

    let leftSelectAll = leftSelectCount == leftTotalCount;
    let rightSelectAll = rightSelectCount == rightTotalCount;
    // console.log(leftSelectKey, rightSelectKey);
    return (
      <div className={styles["tree-select-transfer"]}>
        <div className="tst-l">
          <div className="tst-header">
            {leftTotalCount ?
              <Checkbox
                indeterminate={!leftSelectAll && isHaveLeftChecked}
                checked={leftSelectAll}
                onChange={this.selectOrCancelAll("leftSelectKey", leftSelectKey, leftData, leftSelectAll)}
              >
                {`${leftSelectCount ? leftSelectCount + "/" : ""}${leftTotalCount} 条`}
              </Checkbox> : null
            }
            { titles[0] ? <span style={{float: "right"}}>{titles[0]}</span> : null}
          </div>
          <Input
            placeholder="请输入搜索内容, 输入完按Enter键过滤"
            value={leftIptValue}
            onChange={this.changeIptValue("leftIptValue")}
            style={{ width: "100%", padding: 4 }}
            suffix={leftIptValue ?
              <Icon type="close-circle" theme="filled" onClick={this.clearSearchAndValue("left")} />
              :
              <Icon type="search" onClick={this.begineSearch("left")} />
            }
            onPressEnter={this.begineSearch("left")}
          />
          <div style={{overflow: "auto", height: 220}}>
            <Tree
              showIcon
              defaultExpandAll
              onSelect={this.bindChange("leftSelectKey", fLeftData)}
              switcherIcon={<Icon type="down" />}
            >
              {
                fLeftData.map((item, index) => {
                  if(item.children && item.children.length) {
                    return  <TreeNode title={item.name} key={index}>
                      {
                        item.children.map((childItem) => {
                          let isChecked = childItem.key in leftSelectKey;
                          return <TreeNode
                            icon={
                              <Checkbox checked={isChecked} />
                            }
                            id={childItem.id}
                            onClick={this.bindChange}
                            key={childItem.key}
                            title={childItem.name}
                          />
                        })
                      }
                    </TreeNode>
                  }
                  return <TreeNode  title={item.name} key={index} dataRef={item} />;
                })
              }
            </Tree>
          </div>

        </div>
        <div className="tst-m">
          <Button
            type="primary"
            size="small"
            icon="right"
            style={{marginBottom: 4}}
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
        <div className="tst-r">
          <div className="tst-header">
            {rightTotalCount ?
              <Checkbox
                indeterminate={!rightSelectAll && isHaveRightChecked}
                checked={rightSelectAll}
                onChange={this.selectOrCancelAll("rightSelectKey", rightSelectKey, rightData, rightSelectAll)}
              >
                {`${rightSelectCount ? rightSelectCount + "/" : ""}${rightTotalCount} 条`}
              </Checkbox> : null
            }
            { titles[1] ? <span style={{float: "right"}}>{titles[1]}</span> : null}
          </div>
          <Input
            placeholder="请输入搜索内容, 输入完按Enter键过滤"
            onChange={this.changeIptValue("rightIptValue")}
            value={rightIptValue}
            style={{ width: "100%", padding: 4 }}
            suffix={
              rightIptValue ?
                <Icon type="close-circle" theme="filled" onClick={this.clearSearchAndValue("right")} /> :
                <Icon type="search" onClick={this.begineSearch("right")}/>
            }
            onPressEnter={this.begineSearch("right")}
          />
          <div style={{overflow: "auto", height: 220}}>
            <Tree
              showIcon
              defaultExpandAll
              onSelect={this.bindChange("rightSelectKey", fRightData)}
              switcherIcon={<Icon type="down" />}
            >
              {
                fRightData.map((item, index) => {
                  if(item.children && item.children.length) {
                    return  <TreeNode title={item.name} key={index}>
                      {
                        item.children.map((childItem) => {
                          let isChecked = childItem.key in rightSelectKey;
                          return <TreeNode
                            icon={
                              <Checkbox checked={isChecked} />
                            }
                            id={childItem.id}
                            onClick={this.bindChange}
                            key={childItem.key}
                            title={childItem.name}
                          />
                        })
                      }
                    </TreeNode>
                  }
                })
              }
            </Tree>

          </div>
        </div>
      </div>
    );
  }
}

export default TreeSelectTransfer;
