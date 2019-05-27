import React from 'react';
import $ from 'jquery';
import './style.css';
import {Button,Table,Modal} from 'antd';
class Course extends React.Component{

    constructor(){
        super();
        //局部状态
        this.state={
            teachers:[],
            courses:[],
            visible:false,
            form:{
                name:"",
                credit:"",
                description:"",
                teacherId:""
            }
        }
    }


    componentDidMount(){
        //1.加载教师信息
        this.loadTeachers();
        //1.加载课程信息
        this.loadCourses();
    }


    loadTeachers(){
         //1.加载教师信息
         $.get("http://127.0.0.1:8888/teacher/findAll",({status,message,date})=>{
            if(status===200){
                this.setState({
                    "teachers":date,
                    form:{...this.state.form,...{teacherId:date[0].id}}
                })
            }else{
                alert(message)
            }
        })
    }


    loadCourses(){
         //1.加载课程信息
         $.get("http://127.0.0.1:8888/course/findAllWithTeacher",({status,message,date})=>{
            if(status===200){
                //将查询数据库设置到state中
                this.setState({
                    "courses":date
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
    //     let url="http://127.0.0.1:8888/course/saveOrUpdate";
    //     $.post(url,this.state.form,({message})=>{
    //         alert(message)
    //         //刷新页面
    //         this.loadCourses();
    //     })
    //     event.preventDefault();
    // }


    handleOk=(event)=>{
        this.setState({
             visible:true
        })
        let url="http://127.0.0.1:8888/course/saveOrUpdate";
        $.post(url,this.state.form,({message})=>{
            alert(message)
            //刷新页面
            this.loadCourses();
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
        $.get("http://127.0.0.1:8888/course/findById?id="+id,({status,message,date})=>{
            if(status===200){
                //将查询数据库设置到state中
                this.setState({
                    visible:true,
                    "form":date
                })
                this.loadCourses();
            }else{
                alert(message)
            }
        })
    }


    toAdd=()=>{
        this.setState({
            visible:true,
            form:{
                name:"",
                credit:"",
                description:"",
                teacherId:""
            }
        })
    }


    toDelete=(id)=>{
        //1,通过id查找课程信息
        //2，将返回结果设置到this.state.form中
        //state->form
        $.get("http://127.0.0.1:8888/course/delete?id="+id,({status,message,date})=>{
            alert(message)
            //刷新页面
            this.loadCourses();
        })
    }


    toDeletebatch=()=>{
        
    }


    render(){
        let {teachers,form}=this.state;
        let columns=[
            {
                title: '编号',
                dataIndex: 'id',
                render: text => <a href="javascript:;">{text}</a>,
            },
            {
                title: '课程名称',
                dataIndex: 'name',
            },
            {
                title: '课程学分',
                dataIndex: 'credit',
            },
            {
                title: '课程简介',
                dataIndex: 'description',
            },
            {
                title: '任课老师',
                dataIndex: 'teacher.realname',
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
                <h2>课程管理</h2>
                <Button type="primary" onClick={this.toAdd}>添加</Button>
                <Button type="danger" onClick={this.toDeletebatch}>批量删除</Button>
                <Button type="link">导出</Button>
            
                <Table dataSource={this.state.courses} columns={columns}/>

                

                <Modal
                title="Basic Modal"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                >
                    {/* onSubmit={this.submitHandler} */}
                    <form onSubmit={this.handleOk} style={{fontSize:'20px',fontFamily:'楷体',fontWeight:'900'}}>
                    *课程名称
                    <input type="text" name="name" value={form.name} onChange={this.changeHandler} style={{width:'470px',height:'40px',borderRadius:'5px'}}/><br/>
                    *课程学分
                    <input type="text" name="credit" value={form.credit} onChange={this.changeHandler} style={{width:'470px',height:'40px',borderRadius:'5px'}}/><br/>
                    *课程简介<br/>
                    <textarea name="description" value={form.description} onChange={this.changeHandler} style={{width:'470px',height:'40px',borderRadius:'5px'}}></textarea><br/>
                    *任课老师<br/>
                    <select name="teacherId" value={form.teacherId} onChange={this.changeHandler} style={{width:'230px',height:'40px',borderRadius:'5px'}}>
                        {
                        teachers.map((record)=>{
                            return <option value={record.id} key={record.id}>{record.realname}</option>
                        })
                        }
                    </select>
                        {/* <input type="submit" value="提交"/> */}
                    </form>
                </Modal>
            </div>
        )
    }
}
export default Course;


