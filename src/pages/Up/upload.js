import React, { PureComponent } from 'react';
import { connect } from 'dva';
import storage from '@/utils/storage';
import axiosApi from "../../services/axios";
import { formatMessage, FormattedMessage } from 'umi/locale';
import FooterToolbar from '@/components/FooterToolbar';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  AutoComplete,
  Upload,
  message,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import styles from './style.less';
function onSelect(value) {
  console.log('onSelect', value);
}
const FormItem = Form.Item;
const Dragger = Upload.Dragger;


@connect(({ formup, loading }) => ({
  formup,
  submitting: loading.effects['formManage/submitRegularForm'],
}))
@Form.create()
class Up extends PureComponent {
  state = {
    fileList: [],
    uploading: false,
  };

  handleUpload = e => {
    const { dispatch, form , loading, message } = this.props;
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach((file) => {
      console.log(file)
      formData.append('files[]', file);
      formData.append('type', 'business');
      formData.append('parentpath', 'pm');
      //从localstorage里取，需要修改
      formData.append('corp_id', 1);
    });
    console.log('formData:');
    console.log(formData);
    this.setState({
      uploading: true,
      // fileList: []
    });
    dispatch({
      type: 'formup/submitRegularForm',
      payload: formData,
      callback:()=>{
        this.setState({
          uploading: false,
          fileList: []
        });
      }
    });
  };

  render() {
    const { uploading, fileList } = this.state;
    const {
      loading,
      dispatch,
      formup
    } = this.props;

    const props = {
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        /*dispatch({
          type: 'formManage/beforeupload',
          payload: file,
        });*/
        return false;
      },
      fileList,
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderWrapper>
        <Card title="" bordered={false} style={{ width: '50%',margin:'20px auto',textAlign:'center' }}>
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> 选择文件
            </Button>
          </Upload>
          <Button
            type="plus"
            onClick={this.handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ marginTop: 16 }}
          >
            {uploading ? '上传中...' : '新建项目'}

          </Button>

        </Card>

      </PageHeaderWrapper>
    );
  }
}

export default Up;
