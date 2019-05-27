import React from 'react';
import $ from 'jquery';
import './style.css';
import {Button,Table,Modal} from 'antd';
class StudentCourse extends React.Component{

    constructor(){
        super();
        //局部状态
        this.state={
            visible:false,
            studentcourse:[],
            students:[],
            courses:[],
            form:{
                chooseTime:"",
                grade:"",
                studentId:"",
                courseId:""
            }
        }
    }

    componentDidMount(){
        //1.加载学生信息
        this.loadStudents();
        //1.加载课程信息
        this.loadCourses();
        //加载选课信息
        this.loadStudentCourse();
    }


    loadStudents(){
        //1.加载学生信息
        $.get("http://127.0.0.1:8888/student/findAll",({status,message,date})=>{
           if(status===200){
               this.setState({
                   "students":date,
                   form:{...this.state.form,...{studentId:date[0].id}}
               })
           }else{
               alert(message)
           }
       })
   }


   loadCourses(){
        //1.加载课程信息
        $.get("http://127.0.0.1:8888/course/findAll",({status,message,date})=>{
           if(status===200){
               //将查询数据库设置到state中
               this.setState({
                   "courses":date,
                   form:{...this.state.form,...{courseId:date[0].id}}
               })
           }else{
               alert(message)
           }
       })
   }


   loadStudentCourse(){
       //1.加载选课信息
       $.get("http://127.0.0.1:8888/studentsc/findAllWith",({status,message,date})=>{
        if(status===200){
            //将查询数据库设置到state中
            this.setState({
                "studentcourse":date
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


//表单提交事件
// submitHandler=(event)=>{
//     let url="http://127.0.0.1:8888/studentsc/saveOrUpdate";
//     $.post(url,this.state.form,({message})=>{
//         alert(message)
//         //刷新页面
//         this.loadStudentCourse();
//     })
//     event.preventDefault();
// }

handleOk=(event)=>{
    this.setState({
         visible:true
    })
    let url="http://127.0.0.1:8888/studentsc/saveOrUpdate";
    $.post(url,this.state.form,({message})=>{
        alert(message)
        //刷新页面
        this.loadStudentCourse();
    })
    event.preventDefault();
    this.setState({
        visible:false
   })
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
    $.get("http://127.0.0.1:8888/studentsc/findById?id="+id,({status,message,date})=>{
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
            chooseTime:"",
            grade:"",
            studentId:"",
            courseId:""
        }
    })
}



toDelete=(id)=>{
    //1,通过id查找课程信息
    //2，将返回结果设置到this.state.form中
    //state->form
    $.get("http://127.0.0.1:8888/studentsc/delete?id="+id,({status,message,date})=>{
        alert(message)
        //刷新页面
        this.loadStudentCourse();
    })
}

toDeletebatch=()=>{
        
}

    render(){
        let {students,courses,form}=this.state;
        let columns=[
            {
                title: '编号',
                dataIndex: 'id',
                render: text => <a href="javascript:;">{text}</a>,
            },
            {
                title: '选课时间',
                dataIndex: 'chooseTime',
            },
            {
                title: '选课年级',
                dataIndex: 'grade',
            },
            {
                title: '选课学生',
                dataIndex: 'student.realname',
            },
            {
                title: '选课课程',
                dataIndex: 'course.name',
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
               <h2>选课管理</h2>
                <Button type="primary" onClick={this.toAdd}>添加</Button>
                <Button type="danger" onClick={this.toDeletebatch}>批量删除</Button>
                <Button type="link">导出</Button>
            
                <Table dataSource={this.state.studentcourse} columns={columns}/>

                

                <Modal
                title="Basic Modal"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                >
                    {/* onSubmit={this.submitHandler} */}
                    <form onSubmit={this.handleOk} style={{fontSize:'20px',fontFamily:'楷体',fontWeight:'900'}}>
                    *选课时间<br/>
                    <input type="text" name="chooseTime" value={form.name} onChange={this.changeHandler} style={{width:'470px',height:'40px',borderRadius:'5px'}}/><br/>
                    *选课年级<br/>
                    <input type="text" name="grade" value={form.credit} onChange={this.changeHandler} style={{width:'470px',height:'40px',borderRadius:'5px'}}/><br/>
                    *选课学生<br/>
                    <select name="studentId" value={form.studentId} onChange={this.changeHandler} style={{width:'230px',height:'40px',borderRadius:'5px'}}>
                        {
                        students.map((record)=>{
                            return <option value={record.id} key={record.id}>{record.realname}</option>
                        })
                        }
                    </select><br/>
                    *选课课程<br/>
                    <select name="courseId" value={form.courseId} onChange={this.changeHandler} style={{width:'230px',height:'40px',borderRadius:'5px'}}>
                        {
                        courses.map((record)=>{
                            return <option value={record.id} key={record.id}>{record.name}</option>
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
export default StudentCourse;