(function() {
   const studentsNames = ['Slappy the Frog','lilley the Lizard','Paulurs th Walrus',
                      'Gregory th Goat','Adam the Anaconda'],
          schoolDays = 12;

   const model = {
     init: function(){
       if (!localStorage.attendance) {
          console.log('Creating attendance records...');
          const attendance = this.creatNewAttendance();
          this.initiateAttendance(attendance);
      }
     },
     //generate a random attendance for all the days
     randomAttendance: function(){
           let attendtList = [],
               i=0;

           while(i<schoolDays){
               attendtList.push(Math.random() >= 0.5);
               i++;
           }
           return attendtList;
       },

      // Create  Object with all the student 
      // wich the key is student name and the value is the student attendance 
     creatNewAttendance: function(){
       const attendance = {};
         
         for(name of studentsNames) {
              attendance[name] = this.randomAttendance();
          };
        return attendance;
     },
     // Store the attendance of all student in localStorage
     initiateAttendance:function(attendance){
       localStorage.attendance = JSON.stringify(attendance);
     },

     // Get back the attendance and parse it to Map object
     getAttendance: function(){
       return JSON.parse(localStorage.attendance);
     },
     // Get spesific Student
     getStudentAttendance: function(studentName){
       const attendance = this.getAttendance();
       return attendance[studentName];
     },
     // Getting the attend status for a spesific day to a spesific student
     getStudentDayAttend: function(studentName, day){
       let studentAttend = this.getStudentAttendance(studentName);
       return studentAttend[day-1];
     },
     // Change the attend status for a spesific day to a spesific student
     setStudentDayAttend: function(studentName, day, attendStatus){
       const attendance = this.getAttendance();
       attendance[studentName][day-1] = attendStatus;
       this.initiateAttendance(attendance);
     }
   };

   model.init();
   
   
   const view = {
     init: function(){
       this.studentTable = $('#studentTable');
       this.tableHead = $('#tableHead');
       this.render();
       
     },
     render: function(){
       this.renderHead();
     },

     renderHead: function(){
       let i = 1;
       while(i<= schoolDays){
         this.tableHead.find('.missed-col').before(`<th>${i}</th>`);
         i++;
       }
     }
   };

   view.init();

}());