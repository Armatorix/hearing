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
  name: number
  right: number
  left: number
}

const Results = (props: { data: Datapoint[] }) => {
  const { innerWidth: width, innerHeight: height } = window
  return (
    <Stack spacing={4}>
      <Typography variant="h5">Results</Typography>
      <ResponsiveContainer width="100%" height={height / 2}>
        <LineChart data={props.data}>
          <XAxis dataKey="name" unit="Hz" name="Frequency" />
          <YAxis unit="%" reversed />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip label="name" />
          <Legend />
          <Line type="monotone" dataKey="right" stroke="#8884d8" />
          <Line type="monotone" dataKey="left" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </Stack>
  )
}

export default Results
export type { Datapoint }
