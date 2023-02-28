import { IconButton, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import HelpIcon from '@mui/icons-material/Help'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
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
      <Typography variant="h5">
        Results
        <Tooltip
          title="Lower value is better. Less volume was needed for you to hear the noice."
          disableInteractive
        >
          <IconButton>
            <HelpIcon />
          </IconButton>
        </Tooltip>
      </Typography>
      <ResponsiveContainer width="100%" height={height / 2}>
        <LineChart data={props.data}>
          <XAxis dataKey="name" unit="Hz" name="Frequency" />
          <YAxis unit="%" reversed />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <ChartTooltip label="name" />
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
