"""
금시세 데이터를 시각화하여 PNG 파일로 저장합니다.
"""
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from datetime import datetime
import sys
import io
import os

# Windows 콘솔 인코딩 설정
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    # Windows 한글 폰트 설정
    import matplotlib.font_manager as fm
    font_list = [f.name for f in fm.fontManager.ttflist]
    if 'Malgun Gothic' in font_list:
        plt.rcParams['font.family'] = 'Malgun Gothic'
    elif 'NanumGothic' in font_list:
        plt.rcParams['font.family'] = 'NanumGothic'
    elif 'Gulim' in font_list:
        plt.rcParams['font.family'] = 'Gulim'
    else:
        # 한글 폰트가 없으면 기본 폰트 사용
        plt.rcParams['font.family'] = 'DejaVu Sans'
    plt.rcParams['axes.unicode_minus'] = False  # 마이너스 기호 깨짐 방지
else:
    # Mac/Linux용
    try:
        plt.rcParams['font.family'] = 'AppleGothic'
    except:
        try:
            plt.rcParams['font.family'] = 'NanumGothic'
        except:
            pass

# 스타일 설정
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 6)

def load_data():
    """엑셀 파일에서 데이터를 로드합니다."""
    file_path = 'gold_prices.xlsx'
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"{file_path} 파일을 찾을 수 없습니다.")
    
    df = pd.read_excel(file_path)
    
    # 날짜를 datetime으로 변환
    df['날짜'] = pd.to_datetime(df['고시날짜'], format='%Y.%m.%d')
    
    # 숫자 데이터 변환 (쉼표 제거)
    df['Bid_숫자'] = df['Bid'].astype(str).str.replace(',', '').astype(float)
    df['Ask_숫자'] = df['Ask'].astype(str).str.replace(',', '').astype(float)
    df['국제가_숫자'] = df['국제가 (USD/T.oz)'].astype(str).str.replace(',', '').astype(float)
    df['국내기준가_숫자'] = df['국내기준가 (₩/g)'].astype(str).str.replace(',', '').astype(float)
    
    # 날짜순 정렬
    df = df.sort_values('날짜')
    
    return df

def create_time_series_plot(df):
    """시계열 그래프 - 가격 추이"""
    fig, axes = plt.subplots(2, 2, figsize=(16, 12))
    fig.suptitle('금시세 시계열 분석', fontsize=16, fontweight='bold')
    
    # 1. 국내기준가 추이
    axes[0, 0].plot(df['날짜'], df['국내기준가_숫자'], marker='o', linewidth=2, markersize=4)
    axes[0, 0].set_title('국내기준가 추이 (₩/g)', fontsize=12, fontweight='bold')
    axes[0, 0].set_xlabel('날짜')
    axes[0, 0].set_ylabel('가격 (원)')
    axes[0, 0].grid(True, alpha=0.3)
    axes[0, 0].tick_params(axis='x', rotation=45)
    
    # 2. 국제가 추이
    axes[0, 1].plot(df['날짜'], df['국제가_숫자'], marker='s', color='orange', linewidth=2, markersize=4)
    axes[0, 1].set_title('국제가 추이 (USD/T.oz)', fontsize=12, fontweight='bold')
    axes[0, 1].set_xlabel('날짜')
    axes[0, 1].set_ylabel('가격 (USD)')
    axes[0, 1].grid(True, alpha=0.3)
    axes[0, 1].tick_params(axis='x', rotation=45)
    
    # 3. Bid/Ask 스프레드
    axes[1, 0].plot(df['날짜'], df['Bid_숫자'], label='Bid', marker='o', linewidth=2, markersize=4)
    axes[1, 0].plot(df['날짜'], df['Ask_숫자'], label='Ask', marker='s', linewidth=2, markersize=4)
    axes[1, 0].fill_between(df['날짜'], df['Bid_숫자'], df['Ask_숫자'], alpha=0.3)
    axes[1, 0].set_title('Bid/Ask 가격 비교', fontsize=12, fontweight='bold')
    axes[1, 0].set_xlabel('날짜')
    axes[1, 0].set_ylabel('가격 (USD)')
    axes[1, 0].legend()
    axes[1, 0].grid(True, alpha=0.3)
    axes[1, 0].tick_params(axis='x', rotation=45)
    
    # 4. 이동평균선 (국내기준가)
    df['MA5'] = df['국내기준가_숫자'].rolling(window=5).mean()
    df['MA10'] = df['국내기준가_숫자'].rolling(window=10).mean()
    axes[1, 1].plot(df['날짜'], df['국내기준가_숫자'], label='실제가격', linewidth=2, alpha=0.7)
    axes[1, 1].plot(df['날짜'], df['MA5'], label='5일 이동평균', linewidth=2, linestyle='--')
    axes[1, 1].plot(df['날짜'], df['MA10'], label='10일 이동평균', linewidth=2, linestyle='--')
    axes[1, 1].set_title('국내기준가 이동평균선', fontsize=12, fontweight='bold')
    axes[1, 1].set_xlabel('날짜')
    axes[1, 1].set_ylabel('가격 (원)')
    axes[1, 1].legend()
    axes[1, 1].grid(True, alpha=0.3)
    axes[1, 1].tick_params(axis='x', rotation=45)
    
    plt.tight_layout()
    plt.savefig('gold_prices_timeseries.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ 시계열 그래프 저장: gold_prices_timeseries.png")

def create_statistical_plots(df):
    """통계 분석 그래프"""
    fig, axes = plt.subplots(2, 2, figsize=(16, 12))
    fig.suptitle('금시세 통계 분석', fontsize=16, fontweight='bold')
    
    # 1. 히스토그램 - 국내기준가 분포
    axes[0, 0].hist(df['국내기준가_숫자'], bins=15, edgecolor='black', alpha=0.7, color='skyblue')
    axes[0, 0].axvline(df['국내기준가_숫자'].mean(), color='red', linestyle='--', linewidth=2, label=f'평균: {df["국내기준가_숫자"].mean():.0f}원')
    axes[0, 0].axvline(df['국내기준가_숫자'].median(), color='green', linestyle='--', linewidth=2, label=f'중앙값: {df["국내기준가_숫자"].median():.0f}원')
    axes[0, 0].set_title('국내기준가 분포', fontsize=12, fontweight='bold')
    axes[0, 0].set_xlabel('가격 (원)')
    axes[0, 0].set_ylabel('빈도')
    axes[0, 0].legend()
    axes[0, 0].grid(True, alpha=0.3)
    
    # 2. 박스플롯 - 가격 변동성
    price_data = [df['국내기준가_숫자'], df['국제가_숫자']]
    axes[0, 1].boxplot(price_data, labels=['국내기준가\n(₩/g)', '국제가\n(USD/T.oz)'])
    axes[0, 1].set_title('가격 변동성 비교 (Box Plot)', fontsize=12, fontweight='bold')
    axes[0, 1].set_ylabel('가격')
    axes[0, 1].grid(True, alpha=0.3)
    
    # 3. 일일 변동률
    df['일일변동률'] = df['국내기준가_숫자'].pct_change() * 100
    axes[1, 0].bar(df['날짜'], df['일일변동률'], alpha=0.7, color=['red' if x < 0 else 'blue' for x in df['일일변동률']])
    axes[1, 0].axhline(0, color='black', linestyle='-', linewidth=1)
    axes[1, 0].set_title('일일 가격 변동률 (%)', fontsize=12, fontweight='bold')
    axes[1, 0].set_xlabel('날짜')
    axes[1, 0].set_ylabel('변동률 (%)')
    axes[1, 0].grid(True, alpha=0.3)
    axes[1, 0].tick_params(axis='x', rotation=45)
    
    # 4. 누적 수익률
    df['누적수익률'] = (1 + df['일일변동률']/100).cumprod() - 1
    axes[1, 1].plot(df['날짜'], df['누적수익률'] * 100, marker='o', linewidth=2, markersize=4, color='purple')
    axes[1, 1].axhline(0, color='black', linestyle='--', linewidth=1)
    axes[1, 1].set_title('누적 수익률 추이', fontsize=12, fontweight='bold')
    axes[1, 1].set_xlabel('날짜')
    axes[1, 1].set_ylabel('누적 수익률 (%)')
    axes[1, 1].grid(True, alpha=0.3)
    axes[1, 1].tick_params(axis='x', rotation=45)
    
    plt.tight_layout()
    plt.savefig('gold_prices_statistics.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ 통계 분석 그래프 저장: gold_prices_statistics.png")

def create_correlation_heatmap(df):
    """상관관계 히트맵"""
    fig, ax = plt.subplots(figsize=(10, 8))
    
    # 상관관계 계산
    corr_data = df[['Bid_숫자', 'Ask_숫자', '국제가_숫자', '국내기준가_숫자']].corr()
    
    # 히트맵 생성
    sns.heatmap(corr_data, annot=True, fmt='.3f', cmap='coolwarm', center=0,
                square=True, linewidths=1, cbar_kws={"shrink": 0.8}, ax=ax)
    
    ax.set_title('금시세 변수 간 상관관계 분석', fontsize=14, fontweight='bold', pad=20)
    ax.set_xticklabels(['Bid', 'Ask', '국제가\n(USD/T.oz)', '국내기준가\n(₩/g)'], rotation=0)
    ax.set_yticklabels(['Bid', 'Ask', '국제가\n(USD/T.oz)', '국내기준가\n(₩/g)'], rotation=0)
    
    plt.tight_layout()
    plt.savefig('gold_prices_correlation.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ 상관관계 히트맵 저장: gold_prices_correlation.png")

def create_comparison_chart(df):
    """비교 차트"""
    fig, axes = plt.subplots(2, 1, figsize=(14, 10))
    fig.suptitle('금시세 비교 분석', fontsize=16, fontweight='bold')
    
    # 1. 국내가 vs 국제가 (이중 Y축)
    ax1 = axes[0]
    ax2 = ax1.twinx()
    
    line1 = ax1.plot(df['날짜'], df['국내기준가_숫자'], color='blue', marker='o', 
                     linewidth=2, markersize=4, label='국내기준가 (₩/g)')
    line2 = ax2.plot(df['날짜'], df['국제가_숫자'], color='red', marker='s', 
                     linewidth=2, markersize=4, label='국제가 (USD/T.oz)')
    
    ax1.set_xlabel('날짜', fontsize=11)
    ax1.set_ylabel('국내기준가 (원)', color='blue', fontsize=11, fontweight='bold')
    ax2.set_ylabel('국제가 (USD)', color='red', fontsize=11, fontweight='bold')
    ax1.tick_params(axis='y', labelcolor='blue')
    ax2.tick_params(axis='y', labelcolor='red')
    ax1.tick_params(axis='x', rotation=45)
    ax1.set_title('국내기준가 vs 국제가 비교', fontsize=12, fontweight='bold')
    ax1.grid(True, alpha=0.3)
    
    # 범례
    lines = line1 + line2
    labels = [l.get_label() for l in lines]
    ax1.legend(lines, labels, loc='upper left')
    
    # 2. 가격 범위 (최고가, 최저가, 평균가)
    dates = df['날짜']
    high = df['국내기준가_숫자'].max()
    low = df['국내기준가_숫자'].min()
    mean = df['국내기준가_숫자'].mean()
    
    axes[1].fill_between(dates, low, high, alpha=0.3, color='lightblue', label='가격 범위')
    axes[1].plot(dates, df['국내기준가_숫자'], color='blue', linewidth=2, label='실제 가격')
    axes[1].axhline(mean, color='red', linestyle='--', linewidth=2, label=f'평균: {mean:.0f}원')
    axes[1].axhline(high, color='green', linestyle='--', linewidth=1, alpha=0.5, label=f'최고: {high:.0f}원')
    axes[1].axhline(low, color='orange', linestyle='--', linewidth=1, alpha=0.5, label=f'최저: {low:.0f}원')
    
    axes[1].set_title('국내기준가 범위 분석', fontsize=12, fontweight='bold')
    axes[1].set_xlabel('날짜', fontsize=11)
    axes[1].set_ylabel('가격 (원)', fontsize=11)
    axes[1].legend()
    axes[1].grid(True, alpha=0.3)
    axes[1].tick_params(axis='x', rotation=45)
    
    plt.tight_layout()
    plt.savefig('gold_prices_comparison.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ 비교 차트 저장: gold_prices_comparison.png")

def create_summary_statistics(df):
    """요약 통계 그래프"""
    fig, ax = plt.subplots(figsize=(12, 8))
    
    # 통계값 계산
    stats = {
        '국내기준가': {
            '평균': df['국내기준가_숫자'].mean(),
            '중앙값': df['국내기준가_숫자'].median(),
            '표준편차': df['국내기준가_숫자'].std(),
            '최고가': df['국내기준가_숫자'].max(),
            '최저가': df['국내기준가_숫자'].min(),
            '변동계수': (df['국내기준가_숫자'].std() / df['국내기준가_숫자'].mean()) * 100
        },
        '국제가': {
            '평균': df['국제가_숫자'].mean(),
            '중앙값': df['국제가_숫자'].median(),
            '표준편차': df['국제가_숫자'].std(),
            '최고가': df['국제가_숫자'].max(),
            '최저가': df['국제가_숫자'].min(),
            '변동계수': (df['국제가_숫자'].std() / df['국제가_숫자'].mean()) * 100
        }
    }
    
    # 바 차트로 표시
    categories = ['평균', '중앙값', '최고가', '최저가']
    domestic_values = [
        stats['국내기준가']['평균'],
        stats['국내기준가']['중앙값'],
        stats['국내기준가']['최고가'],
        stats['국내기준가']['최저가']
    ]
    international_values = [
        stats['국제가']['평균'],
        stats['국제가']['중앙값'],
        stats['국제가']['최고가'],
        stats['국제가']['최저가']
    ]
    
    x = np.arange(len(categories))
    width = 0.35
    
    bars1 = ax.bar(x - width/2, domestic_values, width, label='국내기준가 (₩/g)', color='skyblue', alpha=0.8)
    bars2 = ax.bar(x + width/2, international_values, width, label='국제가 (USD/T.oz)', color='orange', alpha=0.8)
    
    # 값 표시
    for bars in [bars1, bars2]:
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height,
                   f'{height:.1f}',
                   ha='center', va='bottom', fontsize=9)
    
    ax.set_ylabel('가격', fontsize=11, fontweight='bold')
    ax.set_title('금시세 주요 통계값 비교', fontsize=14, fontweight='bold', pad=20)
    ax.set_xticks(x)
    ax.set_xticklabels(categories)
    ax.legend()
    ax.grid(True, alpha=0.3, axis='y')
    
    # 통계 텍스트 추가
    stats_text = f"""
    국내기준가 통계:
    • 표준편차: {stats['국내기준가']['표준편차']:.2f}원
    • 변동계수: {stats['국내기준가']['변동계수']:.2f}%
    
    국제가 통계:
    • 표준편차: {stats['국제가']['표준편차']:.2f} USD
    • 변동계수: {stats['국제가']['변동계수']:.2f}%
    """
    ax.text(0.02, 0.98, stats_text, transform=ax.transAxes, fontsize=10,
            verticalalignment='top', bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))
    
    plt.tight_layout()
    plt.savefig('gold_prices_summary.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ 요약 통계 그래프 저장: gold_prices_summary.png")

def main():
    """메인 함수"""
    print("=" * 50)
    print("금시세 데이터 시각화 시작")
    print("=" * 50)
    
    # 데이터 로드
    df = load_data()
    print(f"\n데이터 로드 완료: {len(df)}개 행")
    print(f"날짜 범위: {df['날짜'].min().strftime('%Y-%m-%d')} ~ {df['날짜'].max().strftime('%Y-%m-%d')}")
    
    # 시각화 생성
    print("\n시각화 이미지 생성 중...")
    create_time_series_plot(df)
    create_statistical_plots(df)
    create_correlation_heatmap(df)
    create_comparison_chart(df)
    create_summary_statistics(df)
    
    print("\n" + "=" * 50)
    print("모든 시각화 완료!")
    print("=" * 50)
    print("\n생성된 파일:")
    print("  1. gold_prices_timeseries.png - 시계열 분석")
    print("  2. gold_prices_statistics.png - 통계 분석")
    print("  3. gold_prices_correlation.png - 상관관계 분석")
    print("  4. gold_prices_comparison.png - 비교 분석")
    print("  5. gold_prices_summary.png - 요약 통계")

if __name__ == "__main__":
    main()
