#!/usr/bin/env python
import json
total_instances=1000
file_rules=open('rules.txt','r')
rules_json=open('rules.json', 'w')
count=0
rules=[]
for lines in file_rules:
    count+=1
    dict_rules={
    "Rule_no":"",
    "checking_status":"",
    "duration":"",
    "credit_history":"",
    "purpose":"",
    "credit_amount":"",
    "savings_status":"",
    "employment":"",
    "installment_commitment":"",
    "personal_status":"",
    "other_parties":"",
    "residence_since":"",
    "property_magnitude":"",
    "age":"",
    "other_payment_plans":"",
    "housing":"",
    "existing_credits":"",
    "job":"",
    "num_dependents":"",
    "own_telephone":"",
    "foreign_worker":"",
    "class":"","length":0,"accuracy":0,"coverage":0}
    dict_rules['Rule_no']="Rule "+str(count)
    X,Y=lines.split(':')
    #with 'and' without 'and' empty
    if('AND' in X):
       
        attr=X.split('AND')
        dict_rules['length']=len(attr)
        for index in range(len(attr)):
            attr[index]=attr[index].strip()
            if '=' in attr[index] and '>' in attr[index] and '<' in attr[index]:
                great_index=attr[index].index('>')
                less_index=attr[index].index('<')
                equal_index=attr[index].index('=')
                if great_index<less_index:
                    if equal_index<great_index:
                        attribute,val=attr[index].split('=')
                    else:
                        attribute,val=attr[index].split('>')
                        val='>'+val
                else:
                    if equal_index<less_index:
                        attribute,val=attr[index].split('=')
                    else:
                        attribute,val=attr[index].split('<')
                        val='<'+val
            elif '>' in attr[index] and '<' in attr[index]:
                great_index=attr[index].index('>')
                less_index=attr[index].index('<')
                if great_index<less_index:
                    attribute,val=attr[index].split('>')
                    val='>'+val
                else:
                    attribute,val=attr[index].split('<')
                    val='<'+val
            elif '>' in attr[index] and '=' in attr[index]:
                great_index=attr[index].index('>')
                equal_index=attr[index].index('=')
                if great_index<equal_index:
                    attribute,val=attr[index].split('>')
                    val='>'+val
                else:
                    attribute=attr[index][0:equal_index]
                    val=attr[index][equal_index+1:]
            elif '=' in attr[index] and '<' in attr[index]:
                equal_index=attr[index].index('=')
                less_index=attr[index].index('<')
                if equal_index<less_index:
                    attribute=attr[index][0:equal_index]
                    val=attr[index][equal_index+1:]
                else:
                    attribute,val=attr[index].split('<')
                    val='<'+val
            elif '<' in attr[index]:
                attribute,val=attr[index].split('<')
                val='<'+val
            elif '>' in attr[index]:
                attribute,val=attr[index].split('>')
                val='>'+val
            else:
                attribute,val=attr[index].split('=')
            dict_rules[attribute.strip()]=val.strip()
    elif (X==""):
        length=0
    else:
        length=1
        attr=X.strip()
        attribute,val=attr.split('=')
        dict_rules[attribute.strip()]=val.strip()
    #start with y
    #split on ( and  if '/' exists split on /
    outcome_class,cov_accuracy=Y.split('(')
    dict_rules["class"]=outcome_class.strip()
    if "/" in cov_accuracy:
        num1,num2=cov_accuracy.split('/')
        num1=num1.strip()
        num2=num2.strip()[:-1]
    else:
        num1=cov_accuracy.strip()[:-1]
        num2="0"
    dict_rules["coverage"]=format((float(num1)+float(num2))*100/total_instances, '.2f')
    dict_rules["accuracy"]=format((float(num1)*100)/(float(num1)+float(num2)), '.2f')
    rules.append(dict_rules)
json.dump(rules, rules_json)
            