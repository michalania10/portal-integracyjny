import React from 'react';

function Table(props) {
    return (<table>
        <thead>
            <tr>
                {props.headers.map(header =>
                    <th key={header}>
                        {props.translation.get(header)}
                    </th>
                )}
            </tr>
        </thead>
        <tbody>
            {props.data.map((dataElem, index) =>
                <tr key={dataElem.key ? dataElem.key : index}>
                    {props.headers.map(header =>
                        <td key={header}>
                            {dataElem[header]}
                        </td>
                    )}
                </tr>
            )}
        </tbody>
    </table>);
}

export default Table;