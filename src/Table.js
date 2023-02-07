import React from 'react';
class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: props.data, headers: props.headers, translation: props.translation }
        this.tableHeader = this.tableHeader.bind(this)
        this.dataRow = this.dataRow.bind(this)
        this.tableData = this.tableData.bind(this)
    }

    tableHeader() {
        return this.state.headers.map(header =>
            <th key={header}>
                {this.state.translation[header]}
            </th>
        );
    }

    dataRow(dataElem) {
        return (
            <tr key={dataElem.key}>
                {
                    this.state.headers.map(header =>
                        <td key={header}>
                            {dataElem[header]}
                        </td>
                    )
                }
            </tr>);
    }

    tableData() {
        return this.state.data.map(this.dataRow)
    }

    render() {
        return (
            <table>
                <thead>
                    <tr>
                        {this.tableHeader()}
                    </tr>
                </thead>
                <tbody>
                    {this.tableData()}
                </tbody>
            </table>
        );
    }
}

export default Table;