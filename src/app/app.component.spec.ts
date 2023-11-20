// <ul class="list-group">
// <li *ngFor="let task of getTasksForUsername(username)" class="list-group-item">
//     <div class="task-info">
//         <div class="task-header">
//             <div>
//                 <span [style.color]="task.done ? 'green' : 'red'" class="todo-name">{{
//                     task.todoname }}</span>
//             </div>
//             <div>
//                 <span class="priority" [class]="getPriorityClass(task.priority)">{{
//                     getPriorityLabel(task.priority) }}</span>
//             </div>
//         </div>

//         <!-- Separator between todo name and priority -->
//         <div class="separator"></div>

//         <div class="task-details mt-2">
//             <div class="datetime-info ml-3">
//                 <sub class="small datetime">{{ task.datetime | date: 'dd MMMM yyyy
//                     HH:mm' }}</sub>
//             </div>
//         </div>

//         <!-- Separator between priority and datetime -->
//         <div class="separator"></div>

//         <div class="d-flex justify-content-between align-items-center">
//             <span class="task-status" [class.done]="task.done"
//                 [class.pending]="!task.done">
//                 {{ task.done ? 'Done' : 'Pending' }}
//             </span>
//         </div>
//     </div>
// </li>
// </ul>