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
       this.tableBody = $('#tableBody');
       this.render();
       
     },

     // render the page view
     render: function(){
       this.renderHead();
       this.renderBody();
     },

     //render the head of the table
     renderHead: function(){
       let i = 1;
       while(i<= schoolDays){
         this.tableHead.find('.missed-col').before(`<th>${i}</th>`);
         i++;
       }
     },

     //render the body of the table
     renderBody: function(){
       const $this = this;
       studentsNames.forEach(function(name){
          let studentRow  = `<tr class="student" id="${name}">` ;
          studentRow += `<td class="name-col">${name}</td>`
          let i = 1;
           while(i<= schoolDays){
             const status = model.getStudentDayAttend(name, i);
             if(status){
               studentRow += `<td class="attend-col"><input type="checkbox"checked></td>`;
             }else{
               studentRow += `<td class="attend-col"><input type="checkbox"></td>`;
             }
            
             i++;
          }
          studentRow += `<td class="missed-col">0</td>`;
          studentRow += ' </tr>' 
          $this.tableBody.append(studentRow);


       });
     },
   };


   
   view.init();
   
}());