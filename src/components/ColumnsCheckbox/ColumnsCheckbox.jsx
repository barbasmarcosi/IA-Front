import React, { useEffect, useState } from 'react';
import { Checkbox, Divider } from 'antd';
const CheckboxGroup = Checkbox.Group;
const ColumnsCheckbox = ({ plainOptions, setCheckedColumns }) => {
    const [checkedList, setCheckedList] = useState(plainOptions);
    const checkAll = plainOptions.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;
    const onChange = (list) => {
        setCheckedList(list);
        setCheckedColumns(list)
    };
    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? plainOptions : []);
        setCheckedColumns(e.target.checked ? plainOptions : []);
    };
    useEffect(() => { setCheckedList(plainOptions) }, [])
    return (
        <>
            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll} defaultChecked={plainOptions} >
                Todas
            </Checkbox>
            <Divider />
            <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
        </>
    );
};
export default ColumnsCheckbox;