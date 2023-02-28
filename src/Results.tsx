import { Typography } from '@mui/material'
import { Stack } from '@mui/system'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
type Datapoint = {
  frequency: number
  right: number
  left: number
}

const Results = (props: { data: Datapoint[] }) => {
  return (
    <Stack>
      <Typography variant="h5">Results</Typography>
      {/* <ResponsiveContainer width="100%" height="100%"> */}
      <LineChart width={500} height={300} data={props.data}>
        <XAxis dataKey="frequency" unit="Hz" name="Frequency" />
        <YAxis max={100} min={0} unit="%" reversed />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="right" stroke="#8884d8" />
        <Line type="monotone" dataKey="left" stroke="#82ca9d" />
        <Tooltip />
        <Legend />
      </LineChart>
      {/* </ResponsiveContainer> */}
    </Stack>
  )
}

export default Results
export type { Datapoint }
