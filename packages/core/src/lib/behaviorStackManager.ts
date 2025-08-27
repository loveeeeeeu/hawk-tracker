import { BehaviorStack } from './behaviorStack';
import { BehaviorStackConfig } from '../types/behavior';

/**
 * 行为栈管理器 - 统一管理多个行为栈实例
 * 提供栈的创建、获取、销毁等核心功能
 */
export class BehaviorStackManager {
  private stacks: Map<string, BehaviorStack> = new Map();
  private defaultConfig: BehaviorStackConfig;

  constructor(defaultConfig: BehaviorStackConfig = {}) {
    this.defaultConfig = {
      maxSize: 100,
      maxAge: 5 * 60 * 1000, // 5分钟
      debug: false,
      ...defaultConfig,
    };

    // 创建默认栈
    this.createBehaviorStack('default', this.defaultConfig);
  }

  /**
   * 创建新的行为栈
   * @param name 栈名称
   * @param config 栈配置
   * @returns 行为栈实例
   */
  public createBehaviorStack(
    name: string,
    config?: BehaviorStackConfig,
  ): BehaviorStack {
    // 如果栈已存在，先销毁
    if (this.stacks.has(name)) {
      this.destroyBehaviorStack(name);
    }

    // 合并配置
    const finalConfig: BehaviorStackConfig = {
      ...this.defaultConfig,
      ...config,
      name,
    };

    // 创建新栈
    const stack = new BehaviorStack(finalConfig);
    this.stacks.set(name, stack);

    if (finalConfig.debug) {
      console.log(`[BehaviorStackManager] 创建行为栈: ${name}`, finalConfig);
    }

    return stack;
  }

  /**
   * 获取行为栈
   * @param name 栈名称，不传则返回默认栈
   * @returns 行为栈实例
   */
  public getBehaviorStack(name: string = 'default'): BehaviorStack | undefined {
    return this.stacks.get(name);
  }

  /**
   * 获取或创建行为栈（如果不存在则创建）
   * @param name 栈名称
   * @param config 栈配置
   * @returns 行为栈实例
   */
  public getOrCreateBehaviorStack(
    name: string,
    config?: BehaviorStackConfig,
  ): BehaviorStack {
    let stack = this.getBehaviorStack(name);
    if (!stack) {
      stack = this.createBehaviorStack(name, config);
    }
    return stack;
  }

  /**
   * 销毁行为栈
   * @param name 栈名称
   * @returns 是否销毁成功
   */
  public destroyBehaviorStack(name: string): boolean {
    const stack = this.stacks.get(name);
    if (stack) {
      stack.destroy();
      this.stacks.delete(name);

      if (this.defaultConfig.debug) {
        console.log(`[BehaviorStackManager] 销毁行为栈: ${name}`);
      }
      return true;
    }
    return false;
  }

  /**
   * 销毁所有行为栈
   */
  public destroyAllBehaviorStacks(): void {
    const stackNames = Array.from(this.stacks.keys());
    stackNames.forEach((name) => this.destroyBehaviorStack(name));

    if (this.defaultConfig.debug) {
      console.log(
        `[BehaviorStackManager] 销毁所有行为栈: ${stackNames.join(', ')}`,
      );
    }
  }

  /**
   * 获取所有栈名称
   * @returns 栈名称数组
   */
  public getBehaviorStackNames(): string[] {
    return Array.from(this.stacks.keys());
  }

  /**
   * 获取所有栈的统计信息
   * @returns 统计信息映射
   */
  public getAllBehaviorStackStats(): Record<string, any> {
    const stats: Record<string, any> = {};

    this.stacks.forEach((stack, name) => {
      stats[name] = stack.getStats();
    });

    return stats;
  }

  /**
   * 检查栈是否存在
   * @param name 栈名称
   * @returns 是否存在
   */
  public hasBehaviorStack(name: string): boolean {
    return this.stacks.has(name);
  }

  /**
   * 获取栈数量
   * @returns 栈数量
   */
  public getBehaviorStackCount(): number {
    return this.stacks.size;
  }

  /**
   * 清空所有栈的数据（不销毁栈实例）
   */
  public clearAllBehaviorStacks(): void {
    this.stacks.forEach((stack) => stack.clear());

    if (this.defaultConfig.debug) {
      console.log(`[BehaviorStackManager] 清空所有行为栈数据`);
    }
  }

  /**
   * 更新默认配置
   * @param config 新配置
   */
  public updateDefaultConfig(config: Partial<BehaviorStackConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };

    if (this.defaultConfig.debug) {
      console.log(`[BehaviorStackManager] 更新默认配置`, this.defaultConfig);
    }
  }

  /**
   * 获取默认配置
   * @returns 默认配置
   */
  public getDefaultConfig(): BehaviorStackConfig {
    return { ...this.defaultConfig };
  }
}
