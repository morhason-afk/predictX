import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppStateProvider } from './context/AppStateProvider'
import { AppShell } from './layout/AppShell'
import { CreateForecastPage } from './pages/CreateForecastPage'
import { FeedPage } from './pages/FeedPage'
import { LeaderboardsPage } from './pages/LeaderboardsPage'
import { ProfilePage } from './pages/ProfilePage'
import { SearchPage } from './pages/SearchPage'
import { SettingsPage } from './pages/SettingsPage'
import { StorePage } from './pages/StorePage'

export default function App() {
  return (
    <BrowserRouter>
      <AppStateProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<FeedPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="create" element={<CreateForecastPage />} />
            <Route path="leaderboards" element={<LeaderboardsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="store" element={<StorePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppStateProvider>
    </BrowserRouter>
  )
}
