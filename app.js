// 高德地图API配置
const amapKey = '6188ae61064a32cf491e483dea6133f7';
const geocodeUrl = 'https://restapi.amap.com/v3/geocode/geo';
const regeocodeUrl = 'https://restapi.amap.com/v3/geocode/regeo';

// 获取页面元素
const addressInput = document.getElementById('addressInput');
const searchBtn = document.getElementById('searchBtn');
const resultDiv = document.getElementById('result');

// 添加搜索按钮点击事件
searchBtn.addEventListener('click', async () => {
  const address = addressInput.value.trim();
  
  // 检查输入是否为空
  if (!address) {
    showResult('请输入有效的地址');
    return;
  }

  try {
    // 显示加载状态
    showResult('正在查询中，请稍候...');
    
    // 第一步：将地址转换为坐标
    const geocodeResponse = await fetch(`${geocodeUrl}?address=${encodeURIComponent(address)}&key=${amapKey}`);
    const geocodeData = await geocodeResponse.json();
    
    if (geocodeData.status !== '1' || geocodeData.geocodes.length === 0) {
      showResult('未找到匹配的地址信息');
      return;
    }

    // 获取坐标
    const location = geocodeData.geocodes[0].location;
    const [lng, lat] = location.split(',');

    // 第二步：使用逆地理编码获取详细行政区划信息
    const regeocodeResponse = await fetch(
      `${regeocodeUrl}?location=${lng},${lat}&key=${amapKey}&extensions=base&batch=false&roadlevel=0`
    );
    const regeocodeData = await regeocodeResponse.json();

    if (regeocodeData.status !== '1') {
      showResult('获取行政区划信息失败');
      return;
    }

    // 解析行政区划信息
    const addressComponent = regeocodeData.regeocode.addressComponent;
    const formattedAddress = regeocodeData.regeocode.formatted_address;
    const township = addressComponent.township || '未找到行政街道/乡镇信息';
    const district = addressComponent.district || '';
    const city = addressComponent.city || '';
    const province = addressComponent.province || '';

    // 显示查询结果
    showResult(`
      <h3>查询结果：</h3>
      <p><strong>完整地址：</strong>${formattedAddress}</p>
      <p><strong>所属行政区域：</strong>${province} ${city} ${district}</p>
      <p><strong>所属街道/乡镇：</strong>${township}</p>
    `);
  } catch (error) {
    console.error('查询出错:', error);
    showResult('查询失败，请稍后重试');
  }
});

// 显示结果的函数
function showResult(content) {
  resultDiv.innerHTML = content;
}

// 回车键触发搜索
addressInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});
