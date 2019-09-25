export class NumberUtils {

  public static Random(to: number = 10, from: number = 1): number {
    const rand = (Math.random() * to) + from;
    return Math.floor(rand);
  }

}
