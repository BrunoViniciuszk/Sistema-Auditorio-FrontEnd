import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as chart } from "chart.js/auto";

export const state = {
    labels: ["Disponivel", "Participantes"],
    datasets: [
        {
            label: 'Quantidade de Participantes',
            data: [0, 0],
            backgroundColor: ['gray', 'red'],
            
        }
    ]
}

export default class Grafico extends React.Component {
    render() {
        return (
            <Pie
                data={state}
                options={{
                    title: {
                        display: true,
                        text: 'Average Rainfall per month',
                        fontSize: 20
                    },
                    legend: {
                        display: true,
                        position: 'right'
                    }
                }}
            />
        )
    }
}
