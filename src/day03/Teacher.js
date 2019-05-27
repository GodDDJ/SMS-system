import React from 'react';
import $ from 'jquery';
import './style.css';
import {Button,Table,Modal} from 'antd';
class Teacher extends React.Component{
    constructor(){
        super();
        this.state={
            teachers:[],
            visible:false,
            form:{
                realname:"",
                gender:"",
                username:"",
                password:"",
                type:"",
                status:""
            }
        }
    }



    componentDidMount(){
        this.loadTeachers();
    }

    loadTeachers(){
        //1.加载课程信息
        $.get("http://127.0.0.1:8888/teacher/findAll",({status,message,date})=>{
           if(status===200){
               //将查询数据库设置到state中
               this.setState({
                   "teachers":date
               })
           }else{
               alert(message)
           }
       })
   }


   changeHandler=(event)=>{
    let name=event.target.name;
    let value=event.target.value;
    this.setState({
        form:{...this.state.form,...{[name]:value}}
    })
}

// submitHandler=(event)=>{
//     let url="http://127.0.0.1:8888/teacher/saveOrUpdate";
//     $.post(url,this.state.form,({message})=>{
//         alert(message)
//         //刷新页面
//         this.loadStudents();
//     })
//     event.preventDefault();
// }


   handleOk=(event)=>{
       this.setState({
            visible:true
       })
       let url="http://127.0.0.1:8888/teacher/saveOrUpdate";
       $.post(url,this.state.form,({message})=>{
           alert(message)
           //刷新页面
           this.loadTeachers();
       })
       event.preventDefault();
   }

   handleCancel=()=>{
        this.setState({
            visible:false
        })
    }


    toUpdate=(id)=>{
        //1,通过id查找课程信息
        //2，将返回结果设置到this.state.form中
        //state->form
        $.get("http://127.0.0.1:8888/teacher/findById?id="+id,({status,message,date})=>{
            if(status===200){
                //将查询数据库设置到state中
                this.setState({
                    visible:true,
                    "form":date
                })
            }else{
                alert(message)
            }
        })
    }


   toAdd=()=>{
        this.setState({
            visible:true,
            form:{
                realname:"",
                gender:"",
                username:"",
                password:"",
                type:"",
                status:""
            }
        })
    }

    toDelete=(id)=>{
        $.get("http://127.0.0.1:8888/teacher/delete?id="+id,({status,message,date})=>{
            alert(message)
            //刷新页面
            this.loadTeachers();
        })
    }

    toDeletebatch=()=>{
        
    }


    render(){
        let {form}=this.state;
        let columns=[
            {
                title: '编号',
                dataIndex: 'id',
                render: text => <a href="javascript:;">{text}</a>,
            },
            {
                title: '姓名',
                dataIndex: 'realname',
            },
            {
                title: '性别',
                dataIndex: 'gender',
            },
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '密码',
                dataIndex: 'password',
            },
            {
                title: '类型',
                dataIndex: 'type',
            },
            {
                title: '状态',
                dataIndex: 'status',
            },
            {
                title: '操作',
                render: (text, record) => (
                  <span>
                    {/* <a href="javascript:;">Invite {record.name}</a>
                    <a href="javascript:;">Delete</a> */}
                    <Button onClick={this.toUpdate.bind(this,record.id)}>更新</Button>
                    <Button type="danger" onClick={this.toDelete.bind(this,record.id)}>删除</Button>
                  </span>
                ),
              },
        ];
        return(
            <div>
                <h2>教师管理</h2>
                <Button type="primary" onClick={this.toAdd}>添加</Button>
                <Button type="danger" onClick={this.toDeletebatch}>批量删除</Button>
                <Button type="link">导出</Button>
            
                <Table dataSource={this.state.teachers} columns={columns}/>

                

                <Modal
                title="Basic Modal"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                >
                    {/* onSubmit={this.submitHandler} */}
                    <form  onOk={this.handleOk} style={{fontSize:'20px',fontFamily:'楷体',fontWeight:'900'}}>
                    *姓名
                    <input type="text" name="realname" value={form.realname} onChange={this.changeHandler} style={{width:'460px',height:'40px',borderRadius:'5px'}}/><br/>
                    *性别
                    <input type="text" name="gender" value={form.gender} onChange={this.changeHandler} style={{width:'460px',height:'40px',borderRadius:'5px'}}/><br/>
                    *名称
                    <input type="text" name="username" value={form.username} onChange={this.changeHandler} style={{width:'460px',height:'40px',borderRadius:'5px'}}/><br/>
                    *密码
                    <input type="text" name="password" value={form.password} onChange={this.changeHandler} style={{width:'460px',height:'40px',borderRadius:'5px'}}/><br/>
                    *类型
                    <input type="text" name="type" value={form.type} onChange={this.changeHandler} style={{width:'460px',height:'40px',borderRadius:'5px'}}/><br/>
                    *状态
                    <input type="text" name="status" value={form.status} onChange={this.changeHandler} style={{width:'460px',height:'40px',borderRadius:'5px'}}/>
                    {/* <input type="submit" value="提交"/> */}
                    </form>
                </Modal>
            </div>
        )
    }
}
export default Teacher;