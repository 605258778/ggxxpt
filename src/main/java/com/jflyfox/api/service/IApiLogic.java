package com.jflyfox.api.service;

import com.jflyfox.api.form.ApiResp;
import com.jflyfox.api.form.ApiForm;

/**
 * api实现接口
 * 
 * @author zengw 2017-4-28 15:18:38
 */
public interface IApiLogic extends IApiCommon {

	/**
	 * 返回滚动图片
	 * 
	 * @author zengw 2017-4-28 15:18:38
	 * 
	 * @param form
	 * @return ApiResp
	 */
	public ApiResp rollpicture(ApiForm form);
	/**
	 * 返回栏目列表
	 * 
	 * @author zengw 2017-4-28 15:18:38
	 * 
	 * @param form
	 * @return ApiResp
	 */
	public ApiResp folders(ApiForm form);

	/**
	 * 返回文章列表
	 * 
	 * @author zengw 2017-4-28 15:18:38
	 * 
	 * @param form
	 * @return ApiResp
	 */
	public ApiResp pageArticleSite(ApiForm form);

	/**
	 * 返回文章列表
	 * 
	 * @author zengw 2017-4-28 15:18:38
	 * 
	 * @param form
	 * @return ApiResp
	 */
	public ApiResp pageArticle(ApiForm form);

	/**
	 * 返回对应文章
	 * 
	 * @author zengw 2017-4-28 15:18:38
	 * 
	 * @param form
	 * @return ApiResp
	 */
	public ApiResp article(ApiForm form);
}
