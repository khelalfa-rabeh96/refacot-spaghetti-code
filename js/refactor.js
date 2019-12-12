(function() {
   const studentsNames = ['Slappy the Frog','lilley the Lizard','Paulurs th Walrus',
                      'Gregory th Goat','Adam the Anaconda'],
          schoolDays = 12;

  /*-------- Model ----------*/
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
     },

     //Count the day that the student missed
     countDaysMissed: function(studentName){
       const attendance = this.getStudentAttendance(studentName);
       return attendance.filter(status => !status).length;
     }
   };


   /*-------- Controller ----------*/
   const controller = {

     init: function(){
       model.init();
       view.init();
       view.checkedChange();
     },

     getStudentDayAttend: function(studentName, day){
       return model.getStudentDayAttend(studentName, day);
     },
    
     setStudentDayAttend: function(studentName, day, status){
       model.setStudentDayAttend(studentName, day, status);
     },
      countDaysMissed: function(studentName){
       return model.countDaysMissed(studentName);
     }

   };
   
   
   /*-------- View ----------*/
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
             const status = controller.getStudentDayAttend(name, i);
             if(status){
               studentRow += `<td class="attend-col"><input type="checkbox"checked data-day-nbr="${i}"></td>`;
             }else{
               studentRow += `<td class="attend-col"><input type="checkbox" data-day-nbr="${i}"></td>`;
             }
            
             i++;
          }
          studentRow += `<td class="missed-col">${controller.countDaysMissed(name)}</td>`;
          studentRow += ' </tr>' 
          $this.tableBody.append(studentRow);


       });

     },

     // Change a checkbox checked value
     checkedChange: function(){
       const $this = this;
       this.tableBody.on('click', 'input', function(e){
         const dayStatus = $(e.currentTarget).prop("checked");
               day = $(e.currentTarget).data('day-nbr'),
               studentName = $(e.currentTarget).parents('tr').attr('id');

         controller.setStudentDayAttend(studentName, day, dayStatus);

         $this.tableBody.html('');
         $this.renderBody();
       });

     }
   };

   controller.init();
}());