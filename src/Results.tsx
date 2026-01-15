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

const HelpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
)

const Results = (props: { data: Datapoint[] }) => {
  const { innerHeight: height } = window
  
  return (
    <div className="results-container space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          📊 Your Results
        </h2>
        <div className="group relative">
          <button className="p-1 text-primary-500 dark:text-primary-400 hover:text-secondary-500 dark:hover:text-secondary-400 transition-colors">
            <HelpIcon />
          </button>
          <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-gray-800 dark:bg-gray-900 text-white text-sm rounded-lg 
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-xl">
            Lower values are better - they indicate less volume was needed for you to hear the sound.
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300">
        Your hearing sensitivity across different frequencies. The chart shows how much volume was required for each frequency.
      </p>
      
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
              contentStyle={{
                backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#1f2937',
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
    </div>
  )
}

export default Results
export type { Datapoint }
