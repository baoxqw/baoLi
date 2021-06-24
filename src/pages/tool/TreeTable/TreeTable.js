import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import NormalTable from '@/components/NormalTable';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Icon,
  Row,
  Tree,
  Modal,
  message
} from 'antd';
import { toTree,getParentKey } from "@/pages/tool/ToTree";
const { Option } = Select;
const FormItem = Form.Item;
const { TreeNode } = Tree;
const Search = Input.Search;


@Form.create()

class TreeTable extends PureComponent {
  state={
    visible:false,
    selectedRowKeys:[],
    selectedRows:[],

    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,

    buttonStatus:false,

    addModel:false,

    info:{}
  };

  onSelect = (selectedKeys, info,onSelectTree) => {
    if(selectedKeys.length){
      this.setState({
        buttonStatus:true,
        info
      })
    }else{
      this.setState({
        buttonStatus:false,
        info
      })
    }
    if(typeof onSelectTree === 'function'){
      onSelectTree(selectedKeys, info);
    }
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode defaultExpandAll title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.name} key={item.id} dataRef={item} />;
    });

  onSelectChange = (selectedRowKeys,selectedRows) => {
    this.setState({ selectedRowKeys,selectedRows });
  };

  handleTableChange = (pagination,handleTableChange)=>{
    const obj = {
      pageIndex: pagination.current -1,
      pageSize: pagination.pageSize,
    };
    if(typeof handleTableChange === 'function'){
      handleTableChange(obj);
    }
  }

  onIconClick=(onIconClick)=>{
    const {data:{selectedRowKeys}} = this.props;
    this.setState({
      visible:true,
      selectedRowKeys
    });
    if(typeof onIconClick === 'function'){
      onIconClick();
    }
  };

  handleOk = (onOk)=>{
    const { selectedRowKeys,selectedRows } = this.state;
    const { form,onChange } = this.props;
    if(typeof onOk === 'function'){
      onOk(selectedRowKeys,selectedRows,onChange);
    }
    form.resetFields();
    this.setState({
      visible:false,
      selectedRowKeys:[],
      selectedRows:[],

      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,

      buttonStatus:false,

      addModel:false,

      info:{}
    });
  };

  handleCancel = ()=>{
    const { form } = this.props;
    form.resetFields();
    this.setState({
      visible:false,
      selectedRowKeys:[],
      selectedRows:[],

      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,

      buttonStatus:false,

      addModel:false,

      info:{}
    })
  }

  onHandleSearch = (e,handleSearch)=>{
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if(err) return;
      if(typeof handleSearch === 'function'){
        handleSearch(values);
      }
    })
  }

  onHandleReset = (handleReset)=>{
    const { form } = this.props;
    form.resetFields();
    if(typeof handleReset === 'function'){
      handleReset()
    }

  }

  onButtonEmptyClick = (onButtonEmpty)=>{
    this.setState({
      selectedRowKeys:[],
      selectedRows:[]
    })
    if(typeof onButtonEmpty === 'function'){
      onButtonEmpty();
    }
  }

  onChangeSearch = e => {
    const value = e.target.value;
    const { data:{TreeData} } = this.props;
    if(!value){
      this.setState({expandedKeys:[]})
      return
    }
    const expandedKeys = TreeData
      .map(item => {
        if (item.name.indexOf(value) > -1) {
          return getParentKey(item.id, TreeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    const strExpandedKeys = expandedKeys.map(item =>{
      return item + ''
    });
    this.setState({
      expandedKeys:strExpandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onClickAdd = ()=>{
    this.setState({
      addModel:true
    })
  }

  handleAddOk = (onAddOk)=>{
    const { form } = this.props;
    form.validateFields((err, values) => {
      if(typeof onAddOk === 'function'){
        onAddOk(values).then((res)=>{
          message.success("新建成功",1,()=>{
            form.resetFields();
            this.setState({
              addModel:false
            });
          })
        },()=>{
          message.error("新建失败")
        })
      }
    });
  };

  handleAddCancel = (onAddCancel)=>{
    const { form } = this.props;
    if(typeof onAddCancel === 'function'){
      onAddCancel();
    }
    form.resetFields();
    this.setState({
      addModel:false
    })
  };


  render() {
    const {
      on,
      form,
      form:{getFieldDecorator},
      loading,
      data,
      disabled=false,
      style,
      value
    } = this.props;
    const {
      onSelectTree,
      handleTableChange,
      onIconClick,
      onOk,
      onCancel,
      handleSearch,
      handleReset,
      onButtonEmpty,
      onAddOk,
      onAddCancel,
      onAdd
    } = on;
    let {
      TreeData,
      TableData,
      childrenList=[],
      placeholder,
      columns,
      title,
      fetchList=[],
      add=false,
      width='100%',
    } = data;
    const { selectedRowKeys,searchValue,expandedKeys,autoExpandParent } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      type:'radio'
    };

    if(TableData && TableData.list){
      TableData.list.map(item=>{
        item.key = item.id;
        return item
      })
    }

    const children = (data)=>{
      if(!data || !data.length){
        return;
      }
      return data.map((item)=>{
        return <Option key={item.id}>{item.name}</Option>
      })
    }

    const loop = data =>
      data.map(item => {
        const index = item.name.indexOf(searchValue);
        const beforeStr = item.name.substr(0, index);
        const afterStr = item.name.substr(index + searchValue.length);
        const name =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.name}</span>
          );
        if (item.children) {
          return (
            <TreeNode key={item.id} title={name} dataRef={item}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.id} title={name} dataRef={item}/>;
      });

    return (
      <div>
        <div style={{display:'flex',alignItems:'center'}}>
          <Select
            disabled={disabled}
            suffixIcon={<Icon type="unordered-list" onClick={()=>this.onIconClick(onIconClick)}/>}
            style={{width,...style}}
            value={value}
            open={false}
            placeholder={placeholder}
          >
            {children(childrenList)}
          </Select>
        </div>
        <div>
          <Modal
            title={title}
            destroyOnClose
            visible={this.state.visible}
            centered
            width='70%'
            onOk={()=>this.handleOk(onOk)}
            onCancel={()=>this.handleCancel(onCancel)}
            footer={[<Button key={1} onClick={()=>this.onButtonEmptyClick(onButtonEmpty)} style={{float:'left',display:`${this.state.selectedRowKeys[0]?"inline":"none"}`}}>清空</Button>,
              <Button key={2} onClick={()=>this.handleCancel(onCancel)}>取消</Button>,
              <Button type="primary" key={3} onClick={()=>this.handleOk(onOk)}>确定</Button>]}
          >
            <div style={{display:'flex',height:`${window.innerHeight>960?760:window.innerHeight/1.5}px`}}>
              <Card style={{ width:'22%',overflow:'auto'}} bordered>
                {
                  add?this.state.buttonStatus?<Button onClick={this.onClickAdd} style={{marginBottom:'12px'}}>
                    新建
                  </Button>:'':''
                }
                <div >
                  <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChangeSearch} />
                  <Tree
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onSelect={(selectedKeys,info)=>this.onSelect(selectedKeys, info,onSelectTree)}
                  >
                    {loop(TreeData)}
                  </Tree>
                </div>
              </Card>
              <Card title="" style={{ width:'78%'}} bordered>
                <Form onSubmit={(e)=>this.onHandleSearch(e,handleSearch)} layout="inline" style={{display:'flex',paddingLeft:"12px"}}>
                  <Row style={{display:'flex'}}>
                    {
                      fetchList.map((item,index)=>{
                        return (
                          <FormItem label={item.label} key={index}>
                            {getFieldDecorator(item.code)(item.type?item.type():<Input placeholder={item.placeholder} style={{width:'130px'}}/>)}
                          </FormItem>
                        )
                      })
                    }
                  </Row>
                  <Row style={{marginTop:'4px',marginLeft:'12px'}}>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={()=>this.onHandleReset(handleReset)}>
                      取消
                    </Button>
                  </Row>
                </Form>
                <NormalTable
                  style={{marginTop:'15px'}}
                  loading={loading}
                  scroll={{y:window.screen.height>=900?window.innerHeight/2.5:window.innerHeight/3}}
                  data={TableData}
                  columns={columns}
                  rowSelection={rowSelection}
                  onChange={(pagination)=>this.handleTableChange(pagination,handleTableChange)}
                />
              </Card>
            </div>
          </Modal>
        </div>
        <div>
          <Modal
            title={'新建'}
            destroyOnClose
            visible={this.state.addModel}
            centered
            width='70%'
            onOk={()=>this.handleAddOk(onAddOk)}
            onCancel={()=>this.handleAddCancel(onAddCancel)}>
            {
              typeof onAdd === 'function'?onAdd(form,this.state.info):''
            }
          </Modal>
        </div>
      </div>
    );
  }
}

export default TreeTable;
