import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { TrendingUp, Calendar, BarChart3, DollarSign, RefreshCw, Eye, Target, Activity } from "lucide-react";
import customersService from "../../../Services/CustomersService";
import { authStore } from "../../../Redux/AuthState";
import { toast } from "react-toastify";

export function BasicLineChart(): JSX.Element {
  const [type, setType] = useState<string>("חודשים")
  const [xValues, setXValues] = useState<string[]|number[]>([]);
  const [yValues, setYValues] = useState<number[]>([]); 
  const [isLoading, setIsLoading] = useState(true);

  // טעינת נתונים אמיתיים מהשרת
  useEffect(() => {
    loadRealData();
  }, [type]);

  const loadRealData = async () => {
    setIsLoading(true);
    try {
      const userId = authStore.getState().user?.userId;
      if (!userId) {
        toast.error("יש להתחבר למערכת");
        return;
      }

      if (type === 'חודשים') {
        const data = await customersService.fetchBalancePerMonth(userId);
        setXValues(data.months.map(month => {
          // המרת תאריכים לחודשים בעברית
          const date = new Date(month);
          const monthNames = ['ינו׳', 'פבר׳', 'מרץ', 'אפר׳', 'מאי', 'יוני', 'יולי', 'אוג׳', 'ספט׳', 'אוק׳', 'נוב׳', 'דצמ׳'];
          return monthNames[date.getMonth()];
        }));
        setYValues(data.values);
      } else {
        const data = await customersService.fetchBalancePerYear(userId);
        setXValues(data.years);
        setYValues(data.values);
      }
    } catch (error: any) {
      console.error("Error loading balance data:", error);
      toast.error("שגיאה בטעינת נתוני היתרות");
      // במקרה של שגיאה, נציג נתונים ריקים
      setXValues([]);
      setYValues([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleType = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setType(type === "חודשים" ? 'שנים' : 'חודשים');
  }

  const refreshData = () => {
    loadRealData();
  }

  const currentBalance = yValues.length > 0 ? yValues[yValues.length - 1] : 0;
  const previousBalance = yValues.length > 1 ? yValues[yValues.length - 2] : 0;
  const changePercentage = previousBalance > 0 ? ((currentBalance - previousBalance) / previousBalance * 100) : 0;
  const isPositive = changePercentage >= 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return ( 
    <div className="dashboard-container">
      
      {/* כותרת ראשית עם כפתורי פקדים */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title-section">
            <div className="title-text">
              <h1 className="main-title">לוח הביצועים הכספיים</h1>
            </div>
          </div>
          
          <div className="header-controls">
            <div className="view-toggle">
              <button 
                onClick={toggleType}
                className="toggle-btn"
              >
                <div className="toggle-content">
                  {type === 'חודשים' ? <Calendar className="toggle-icon" /> : <BarChart3 className="toggle-icon" />}
                  <span>תצוגה לפי {type == 'חודשים' ? 'שנים' : 'חודשים'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

   

      {/* אזור הגרף הראשי */}
      <div className="chart-panel">
        <div className="chart-content-area">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-animation">
                <div className="loading-spinner"></div>
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <h3 className="loading-title">טוען נתונים...</h3>
              <p className="loading-text">מכין את הגרף עבורך</p>
            </div>
          ) : yValues.length === 0 ? (
            <div className="empty-state">
              <div className="empty-illustration">
                <BarChart3 className="empty-icon" />
                <div className="empty-circle"></div>
              </div>
              <h3 className="empty-title">אין נתונים זמינים</h3>
              <p className="empty-text">לא נמצאו נתוני יתרות לתקופה שנבחרה</p>
              <button onClick={refreshData} className="empty-action">
                <RefreshCw className="empty-action-icon" />
                <span>נסה שוב</span>
              </button>
            </div>
          ) : (
            <div className="chart-wrapper">
              <LineChart
                xAxis={[{ 
                  scaleType: "band", 
                  data: xValues,
                  label: type === 'חודשים' ? "חודש" : 'שנה',
                  labelStyle: {
                    fontSize: 14,
                    fontWeight: '600',
                    fill: '#6b7280',
                    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
                  }
                }]}
                yAxis={[
                  {
                    position: "left",
                    label: "יתרה (₪)",
                    labelStyle: {
                      fontSize: 14,
                      fontWeight: '600',
                      fill: '#6b7280',
                      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
                    }
                  }
                ]}
                series={[{ 
                  data: yValues,
                  color: '#3b82f6',
                  curve: 'catmullRom',
                  area: true
                }]}
                width={1000}
                height={450}
                margin={{ left: 100, right: 50, top: 40, bottom: 80 }}
                grid={{ vertical: true, horizontal: true }}
                sx={{
                  '.MuiLineElement-root': {
                    strokeWidth: 3,
                    filter: 'drop-shadow(0 2px 8px rgba(59, 130, 246, 0.2))',
                    stroke: 'url(#lineGradient)'
                  },
                  '.MuiAreaElement-root': {
                    fill: 'url(#areaGradient)',
                    opacity: 1
                  },
                  '.MuiMarkElement-root': {
                    strokeWidth: 2,
                    r: 5,
                    fill: '#ffffff',
                    stroke: '#3b82f6',
                    filter: 'drop-shadow(0 1px 3px rgba(59, 130, 246, 0.3))',
                    transition: 'all 0.2s ease'
                  },
                  '.MuiChartsGrid-line': {
                    stroke: '#f1f5f9',
                    strokeWidth: 1,
                    opacity: 0.8
                  },
                  '.MuiChartsAxis-line': {
                    stroke: '#d1d5db',
                    strokeWidth: 1
                  },
                  '.MuiChartsAxis-tick': {
                    stroke: '#d1d5db',
                    strokeWidth: 1
                  },
                  '.MuiChartsAxis-tickLabel': {
                    fill: '#6b7280',
                    fontSize: 12,
                    fontWeight: 500,
                    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
                  }
                }}
              />
              
              {/* SVG Gradients for the chart */}
              <svg width="0" height="0" style={{position: 'absolute'}}>
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
                    <stop offset="100%" stopColor="rgba(59, 130, 246, 0.02)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          )}
        </div>
      </div>
      
      {/* פוטר עם סטטוס */}
      <div className="dashboard-footer">
        <div className="status-bar">
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span className="status-text">מעודכן לתאריך {new Date().toLocaleDateString('he-IL')}</span>
          </div>
        
        </div>
      </div>
    </div>
  );
}