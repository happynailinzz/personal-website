// 表格排序功能 for .styled-table
// 支持数字、百分比、文本类型，点击表头排序，排序状态图标高亮

document.addEventListener('DOMContentLoaded', function () {
  // 获取所有带.styled-table类的表格
  const tables = document.querySelectorAll('table.styled-table');

  tables.forEach(table => {
    const headers = table.querySelectorAll('th.sortable-header');
    headers.forEach((th, colIdx) => {
      th.addEventListener('click', function () {
        sortTableByColumn(table, colIdx, th);
      });
    });
  });

  // 排序主函数
  function sortTableByColumn(table, column, th) {
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.querySelectorAll('tr'));
    // 判断当前排序状态
    const currentOrder = th.getAttribute('data-sort-order') || 'none';
    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';

    // 清除所有表头排序状态
    table.querySelectorAll('th.sortable-header').forEach(header => {
      header.setAttribute('data-sort-order', 'none');
      // 恢复图标颜色
      const icon = header.querySelector('.fa-sort');
      if (icon) icon.style.color = '#b0c4de';
    });
    // 设置当前表头排序状态
    th.setAttribute('data-sort-order', newOrder);
    // 高亮当前排序图标
    const icon = th.querySelector('.fa-sort');
    if (icon) icon.style.color = '#1e90ff';

    // 获取所有行的单元格内容
    const getCellValue = (row) => {
      const cell = row.children[column];
      return cell ? cell.textContent.trim() : '';
    };

    // 判断列类型（数字/百分比/文本）
    function parseValue(val) {
      if (/^[-+]?\d+(\.\d+)?%$/.test(val)) {
        return parseFloat(val.replace('%', ''));
      } else if (/^[-+]?\d+(\.\d+)?$/.test(val.replace(/,/g, ''))) {
        return parseFloat(val.replace(/,/g, ''));
      } else {
        return val;
      }
    }

    // 排序函数
    rows.sort((a, b) => {
      let vA = parseValue(getCellValue(a));
      let vB = parseValue(getCellValue(b));
      // 数字排序
      if (typeof vA === 'number' && typeof vB === 'number') {
        return newOrder === 'asc' ? vA - vB : vB - vA;
      }
      // 字符串排序
      return newOrder === 'asc'
        ? String(vA).localeCompare(String(vB), 'zh')
        : String(vB).localeCompare(String(vA), 'zh');
    });

    // 动画：先淡出所有行
    tbody.querySelectorAll('tr').forEach(tr => {
      tr.style.transition = 'opacity 0.2s';
      tr.style.opacity = 0;
    });
    setTimeout(() => {
      // 清空tbody并重新插入排序后的行
      rows.forEach(tr => tbody.appendChild(tr));
      // 再淡入
      tbody.querySelectorAll('tr').forEach(tr => {
        tr.style.opacity = 1;
      });
    }, 200);
  }

  // 华为数字化转型成效可视化（Chart.js）
  const ctx = document.getElementById('chart-huawei-effect');
  if (ctx) {
    // 示例数据：单位为百分比变化
    const data = {
      labels: ['销售收入', '人员数量', '存货周转天数', '订单处理时间'],
      datasets: [
        {
          label: '变化幅度',
          data: [100, 0, -60, -30], // 销售收入翻番(+100%), 人员未显著增长(0%), 周转天数-60%, 订单处理-30%
          backgroundColor: [
            '#1e90ff', // 销售收入高亮
            '#b0c4de', // 人员
            '#e67e22', // 周转天数
            '#e74c3c'  // 订单处理
          ],
          borderRadius: 8,
        }
      ]
    };
    const options = {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              label += context.parsed.y + '%';
              return label;
            }
          }
        },
        title: {
          display: true,
          text: '华为数字化转型成效对比',
          color: '#222',
          font: { size: 18, weight: 'bold' }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          min: -100,
          max: 120,
          ticks: {
            callback: function(value) { return value + '%'; },
            color: '#666',
            font: { size: 14 }
          },
          grid: { color: '#eaf4ff' }
        },
        x: {
          ticks: { color: '#333', font: { size: 14 } },
          grid: { display: false }
        }
      },
      animation: {
        duration: 1200,
        easing: 'easeOutQuart'
      }
    };
    new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options
    });
  }

  // 盘古大模型分层结构SVG动画
  animatePanguSVG();
});

// 盘古大模型分层结构SVG动画
function animatePanguSVG() {
  const layers = [
    { rect: 'pangu-l0-rect', text: 'pangu-l0-text', color: '#1e90ff', base: '#eaf4ff', tooltip: '基础大模型：NLP、CV、多模态等' },
    { rect: 'pangu-l1-rect', text: 'pangu-l1-text', color: '#1e90ff', base: '#f7f9fb', tooltip: '行业大模型：政务、金融、制造等' },
    { rect: 'pangu-l2-rect', text: 'pangu-l2-text', color: '#1e90ff', base: '#f0f4f8', tooltip: '场景大模型：具体业务场景即用型' }
  ];
  let delay = 0;
  layers.forEach((layer, idx) => {
    const rect = document.getElementById(layer.rect);
    const text = document.getElementById(layer.text);
    if (rect && text) {
      // 初始状态
      rect.style.transition = 'fill 0.5s, filter 0.3s';
      text.style.transition = 'opacity 0.5s';
      rect.setAttribute('fill', layer.base);
      text.style.opacity = 0.2;
      // 动画依次高亮
      setTimeout(() => {
        rect.setAttribute('fill', layer.color);
        text.style.opacity = 1;
        // 0.8秒后恢复原色
        setTimeout(() => {
          rect.setAttribute('fill', layer.base);
        }, 800);
      }, delay);
      delay += 700;
      // 悬停高亮与tooltip
      rect.addEventListener('mouseenter', () => {
        rect.setAttribute('fill', layer.color);
        text.style.opacity = 1;
        showTooltip(rect, layer.tooltip);
      });
      rect.addEventListener('mouseleave', () => {
        rect.setAttribute('fill', layer.base);
        hideTooltip();
      });
      text.addEventListener('mouseenter', () => {
        rect.setAttribute('fill', layer.color);
        text.style.opacity = 1;
        showTooltip(rect, layer.tooltip);
      });
      text.addEventListener('mouseleave', () => {
        rect.setAttribute('fill', layer.base);
        hideTooltip();
      });
    }
  });
}

// 简单tooltip实现
function showTooltip(target, text) {
  let tooltip = document.getElementById('svg-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'svg-tooltip';
    tooltip.style.position = 'fixed';
    tooltip.style.background = 'rgba(30,144,255,0.95)';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '6px 14px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontSize = '15px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.zIndex = 9999;
    tooltip.style.boxShadow = '0 2px 8px rgba(30,144,255,0.15)';
    document.body.appendChild(tooltip);
  }
  tooltip.textContent = text;
  tooltip.style.display = 'block';
  // 计算位置
  const rect = target.getBoundingClientRect();
  tooltip.style.left = (rect.left + rect.width/2 - tooltip.offsetWidth/2) + 'px';
  tooltip.style.top = (rect.top - 36) + 'px';
}
function hideTooltip() {
  const tooltip = document.getElementById('svg-tooltip');
  if (tooltip) tooltip.style.display = 'none';
} 