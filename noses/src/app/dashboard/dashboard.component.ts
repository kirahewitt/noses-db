import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { Policy } from  '../policy';
import { MatTableModule, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  policies:  Policy[];
  selectedPolicy:  Policy  = { id :  null , number:null, amount:  null};
  dataSource: Policy[]

  constructor(private apiService: BackendService) { }

  ngOnInit() {
    this.apiService.readPolicies().subscribe((policies: Policy[])=>{
      this.policies = policies;
      this.dataSource = policies;
      console.log(this.dataSource);
    })
  }

  createOrUpdatePolicy(form){
    if(this.selectedPolicy && this.selectedPolicy.id){
      form.value.id = this.selectedPolicy.id;
      this.apiService.updatePolicy(form.value).subscribe((policy: Policy)=>{
        // console.log("Policy updated" , policy);
      });
    }
    else{

      this.apiService.createPolicy(form.value).subscribe((policy: Policy)=>{
        // console.log("Policy created, ", policy);
      });
    }

  }

  selectPolicy(policy: Policy){
    this.selectedPolicy = policy;
  }

  deletePolicy(id){
    this.apiService.deletePolicy(id).subscribe((policy: Policy)=>{
      // console.log("Policy deleted, ", policy);
    });
  }
}
