
class Solution {
    class Apple { 
        int quantity; 
        int date; 
        Apple(int quantity, int date){
            this.quantity = quantity; 
            this.date = date;
        }
    }
    public int eatenApples(int[] apples, int[] days) {
        PriorityQueue<Apple> minHeap = new PriorityQueue<Apple>(
            (a,b) -> a.date - b.date
        );
        int n = apples.length;
        int count = 0;
        int i =0 ;
        while(i < n || !minHeap.isEmpty()){
            if(i < n && apples[i] > 0){
                Apple apple= new Apple(apples[i], i + days[i]);
                minHeap.add(apple);
            }
            while(!minHeap.isEmpty() && minHeap.peek().date <= i){
                minHeap.poll();
            }
            
            if(!minHeap.isEmpty()){
                Apple apple = minHeap.poll();
                apple.quantity -= 1;
                if(apple.quantity > 0){
                    minHeap.offer(apple);
                }
                count++;
            }
            i++;
        }
        return count;
    }
}