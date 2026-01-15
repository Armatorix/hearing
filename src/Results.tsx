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
    <Stack spacing={4} className="results-container">
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333' }}>
          📊 Your Results
        </Typography>
        <Tooltip
          title="Lower values are better - they indicate less volume was needed for you to hear the sound."
          disableInteractive
        >
          <IconButton sx={{ color: '#667eea' }}>
            <HelpIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <Typography variant="body1" sx={{ color: '#555' }}>
        Your hearing sensitivity across different frequencies. The chart shows how much volume was required for each frequency.
      </Typography>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={height / 2}>
          <LineChart data={props.data}>
            <XAxis 
              dataKey="name" 
              unit="Hz" 
              name="Frequency"
              style={{ fontSize: '14px', fontWeight: 600 }}
            />
            <YAxis 
              unit="%" 
              reversed
              style={{ fontSize: '14px', fontWeight: 600 }}
            />
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
            <ChartTooltip 
              label="name"
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '2px solid #667eea',
                borderRadius: '8px',
                fontWeight: 600,
              }}
            />
            <Legend 
              wrapperStyle={{ fontWeight: 600 }}
            />
            <Line 
              type="monotone" 
              dataKey="right" 
              stroke="#667eea" 
              strokeWidth={3}
              name="Right Ear"
              dot={{ fill: '#667eea', r: 5 }}
              activeDot={{ r: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="left" 
              stroke="#f5576c" 
              strokeWidth={3}
              name="Left Ear"
              dot={{ fill: '#f5576c', r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Stack>
  )
}

export default Results
export type { Datapoint }
