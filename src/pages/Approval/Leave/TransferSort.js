import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Transfer,
  Row, Form, Col, Button,
} from 'antd';

@connect(({ leave, loading }) => ({
  leave,
  loading: loading.models.leave,
}))
@Form.create()
class TransferSort extends PureComponent {
  state = {
    targetKeys:[],
    dataList:[]
  };


  componentDidMount(){
    const {dispatch} = this.props;
    dispatch({
      type:'leave/fetch',
      payload: {
        pageSize:1000,
      },
      callback:(res)=>{
        if(res){
          res.map((item)=>{
            item.key = item.id;
            return item
          })
          this.setState({
            dataList:res
          })
        }
      }
    })
  }

  filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1

  handleChange = async (targetKeys,direction,moveKeys) => {
    console.log(moveKeys);
    console.log(this.state.dataList);
    if(direction === 'right'){
      await this.setState({ targetKeys:[...this.state.targetKeys,...moveKeys]});
      console.log("right",this.state.targetKeys);
      return
    }
    await this.setState({ targetKeys});
    console.log("left",this.state.targetKeys);
  };

  toNextClick = ()=>{
    const { toNext } = this.props;
    const {targetKeys,dataList} = this.state;
    toNext(1,targetKeys,dataList)
  }
  render() {
    const { onNext } = this.props;
    const { dataList } = this.state;
   return (
     <Row>
       <div>
         <Row className="mg-b">
           <Col span={24} offset={2}>
             <Transfer
               dataSource={dataList}
               filterOption={this.filterOption}
               targetKeys={this.state.targetKeys}
               onChange={this.handleChange}
               render={item => item.name}
             />
           </Col>
         </Row>

         <Row type="flex" justify="center">
           <Col>
             <Button onClick={() => onNext(-1)} className="mg-r">
               上一步
             </Button>
             <Button type="primary" onClick={this.toNextClick}>
               下一步
             </Button>
           </Col>
         </Row>
       </div>
     </Row>
   )
  }
}

export default TransferSort;
