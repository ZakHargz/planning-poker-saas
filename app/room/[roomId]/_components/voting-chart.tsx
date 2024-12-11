import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface VotingChartProps {
  votes: (number | string)[]
  average: number | string
}

export function VotingChart({ votes, average }: VotingChartProps) {
  const data = votes.reduce((acc, vote) => {
    acc[vote] = (acc[vote] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(data).map(([value, count]) => ({
    value,
    count,
  }))

  const isNumeric = votes.every(vote => typeof vote === 'number')

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Vote Distribution</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="value"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Bar
                dataKey="count"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
          <p className="text-xl font-bold">
            Average: {isNumeric ? (typeof average === 'number' ? average.toFixed(1) : average) : 'N/A'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

