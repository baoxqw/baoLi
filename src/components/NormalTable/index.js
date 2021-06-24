import React, { PureComponent, Fragment } from 'react';
import { Table, Select,Checkbox,Tooltip  } from 'antd';
import styles from './index.less';
const { Option } = Select;

class NormalTable extends PureComponent {
  constructor(props) {
    super(props);
    let { columns,len = 180 } = props;
    let coplyColumns = [];
    if(columns.length){
      columns = columns.map((item,index) =>{
        item.sort = index;
        if(!item.width){
          item.width = len;
        }
        if(!('render' in item)){
          item.render = text => <Tooltip title={text}>
            <div style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              width: 100
            }}>{text}</div>
          </Tooltip>
        }

        item.check = false;
        if(index === columns.length -1){
          item = {
            ...item,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
              const options = coplyColumns.map((ite,index)=>{
                if(index === coplyColumns.length - 1){
                  return
                }
                return <Option key={index}>
                  <Checkbox onChange={(e)=>this.onChange(e,ite)} defaultChecked={true}/> {ite.title}
                </Option>
              });
              return <Select
                style={{ width: 120,margin:10 }}
                value={this.state.columns.length-1}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                open={this.state.open}
              >
                {options}
              </Select>
            },
            onFilterDropdownVisibleChange:(visible)=>{
              this.setState({
                open:visible
              })
              return {
                filterDropdownVisible:visible
              }
            }
          }
        }else{
          item = {
            ...item,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
              return <div style={{padding:12}}>
                <Checkbox onChange={(e)=>this.onChangeCheck(e,item,coplyColumns[index])} checked={item.check}>锁定</Checkbox>
              </div>
            },

          }
        }
        return item
      });
      coplyColumns = [...columns];
    }
    this.state = {
      selectedRowKeys: [],
      columns,
      open:false,
      check:{}
    };
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  onChange = (e,item)=>{
    const { columns } = this.state;
    const { onClickColumns } = this.props;
    if(e.target.checked){
      columns.push(item);
      columns.sort((a,b)=>{
        return a.sort - b.sort
      });
    }else{
      columns.map((ite,i)=>{
        if(ite.sort === item.sort){
          columns.splice(i,1)
        }
      });
    }
    if(typeof onClickColumns === 'function'){
      onClickColumns([...columns])
    }
    this.setState({
      columns:[...columns]
    })
  };

  onFocus = ()=>{
    this.setState({
      open:true
    })
  };

  onBlur = ()=>{
    this.setState({
      open:false
    })
  };

  onChangeCheck = (e,data,cdata)=>{
    const { columns } = this.state;
    columns.map((item) =>{
      if(item.dataIndex === data.dataIndex){
        if(e.target.checked === true){
          item.fixed = 'left';
          item.check = true;
          item.sort = - (columns.length - item.sort);
        }else{
          item.fixed = '';
          item.check = false;
          item.sort = columns.length - Math.abs(item.sort)
        }
      }
    })

    columns.sort((a,b)=>{
      return a.sort - b.sort
    });

    this.setState({
      columns:[...columns]
    })
  }

  render() {
    const { selectedRowKeys, needTotalList,columns } = this.state;
    const { data = {}, rowKey, len = 180,...rest } = this.props;
    const { list = [], pagination } = data;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    if(!rest.scroll){
      rest.scroll = {};
      let cun = 0;
      let length = columns.length;
      columns.map(item=>{
        if(item.width !== len){
          cun = item.width + cun;
          length = length - 1;
        }
      });
      rest.scroll.x = cun + length * len
      rest.scroll.y = 280
    }else{
      if(!rest.scroll.x){
        rest.scroll = {
          ...rest.scroll
        };
        let cun = 0;
        let length = columns.length;
        columns.map(item=>{
          if(item.width !== len){
            cun = item.width + cun;
            length = length - 1;
          }
        });
        rest.scroll.x = cun + length * len
      }
    }
    return (
      <div className={styles.standardTable}>
        <Table
          rowKey={rowKey || 'key'}
          dataSource={list}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
          columns={this.state.columns}
        />
      </div>
    );
  }
}

export default NormalTable;
